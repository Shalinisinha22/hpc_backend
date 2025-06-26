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

    private getAesKey(): Buffer {
        return crypto.createHash('md5').update(this.config.workingKey).digest();
    }
    
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
       
        const orderId = request.bookingId ? String(request.bookingId) : uuidv4();

        const redirect_url = request.redirectUrl;
        const cancel_url = request.cancelUrl;

        const paymentData = {
            order_id: orderId, 
            amount: request.amount.toString(),
            currency: request.currency || this.config.currency,
            redirect_url,
            cancel_url,
            merchant_id: this.config.merchantId   
        };
     
        const dataString = qs.stringify(paymentData);
      
        const encRequest = this.encrypt(dataString);
 
        console.log('encRequest =>', encRequest);
        console.log('access_code =>', this.config.accessCode);
    

        return {
            url: 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
            parameters: {
                access_code: this.config.accessCode,
                encRequest
            }
        };
    }
}