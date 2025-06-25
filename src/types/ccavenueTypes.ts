export interface CCAvenueResponse {
    order_id: string;
    amount: string;
    currency: string;
    encResp: string;
    [key: string]: any;
}

export interface CCAvenuePaymentRequest {
    bookingId: string;
    amount: number;
    currency: string;
    redirectUrl: string;
    cancelUrl: string;
    billingName: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingCountry: string;
    billingZip: string;
    billingEmail: string;
    billingPhone: string;
    [key: string]: any;
}
