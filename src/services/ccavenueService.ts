import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import qs from 'querystring';

interface CCAvenueConfig {
    merchantId: string;
    workingKey: string;
    accessCode: string;
    currency: string;
    returnUrl: string;
    cancelUrl: string;
}

export interface PaymentRequest {
    bookingId: string;
    amount: number;
    currency: string;
    redirectUrl: string;
    cancelUrl: string;
  
}

export class CCAvenueService {
    private config: CCAvenueConfig;

    constructor(config: CCAvenueConfig) {
        this.config = config;
    }

    // Generate AES key using MD5 hash of working key
    private getAesKey(): Buffer {
        return crypto.createHash('md5').update(this.config.workingKey).digest();
    }

    // Encrypt the request data using AES-128-CBC
  private encrypt(data: string): string {
    const key = this.getAesKey();
    const iv = Buffer.alloc(16, '\0'); // 16-byte zero IV
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64'); 
    encrypted += cipher.final('base64');                    
    return encrypted;
}


    // Initiate payment and return data for form POST
    async initiatePayment(request: PaymentRequest): Promise<{ url: string; parameters: Record<string, string> }> {
        // Use bookingId as order_id if provided, else generate a new one
        const orderId = request.bookingId ? String(request.bookingId) : uuidv4();

        // Use NGROK_URL if present, else fallback to config
        const baseUrl = process.env.BASE_URL;
        const redirect_url = `${baseUrl}/api/v1/ccavenue/payment-success`;
        const cancel_url = `${baseUrl}/api/v1/ccavenue/payment-cancel`;

        // Prepare data to be encrypted (DO NOT include access_code or checksum)
        const paymentData = {
            order_id: orderId, // Always present
            amount: request.amount.toString(),
            currency: request.currency || this.config.currency,
            redirect_url,
            cancel_url,
            merchant_id: this.config.merchantId // Only merchant_id, not access_code
        };

        // Convert object to query string
        const dataString = qs.stringify(paymentData);

        // Encrypt using working key
        const encRequest = this.encrypt(dataString);

        // Log for debugging
        console.log('encRequest =>', encRequest);
        console.log('access_code =>', this.config.accessCode);
        // Optionally log the plain data string for debugging
        // console.log('plainData =>', dataString);

        // Return URL and parameters to be used in frontend form post
        return {
            url: 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
            parameters: {
                access_code: this.config.accessCode,
                encRequest
            }
        };
    }
}
