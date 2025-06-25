export interface PaymentRequest {
    amount: number;
    bookingId: string;
    billingDetails: {
        name: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        email: string;
        phone: string;
    };
}

export interface PaymentResponse {
    success: boolean;
    data: {
        paymentUrl: string;
        bookingId: string;
        amount: number;
    };
}

export type PaymentMethod = 'ccavenue' | 'pay-later';

export interface BookingPaymentResponse {
    booking: {
        _id: string;
        status: 'pending' | 'completed' | 'cancelled';
        paymentStatus: 'pending' | 'confirmed' | 'cancelled';
        // Add other booking fields as needed
    };
    payment?: PaymentResponse;
    paymentMethod: PaymentMethod;
}
