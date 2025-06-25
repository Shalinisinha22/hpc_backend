import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { CCAvenueService } from '../services/ccavenueService';
import { Document } from 'mongoose';
import { Booking } from '../models/bookingModel';
import { PaymentRequest, PaymentMethod, BookingPaymentResponse } from '../types/paymentTypes';
import { CCAvenueResponse, CCAvenuePaymentRequest } from '../types/ccavenueTypes';
import { AuthRequest } from '../types/authTypes';

export class BookingController {
    private bookingService: BookingService;
    private ccavenueService: CCAvenueService;

    constructor() {
        this.bookingService = new BookingService();
        this.ccavenueService = new CCAvenueService({
            merchantId: process.env.CCAVENUE_MERCHANT_ID || '',
            workingKey: process.env.CCAVENUE_WORKING_KEY || '',
            accessCode: process.env.CCAVENUE_ACCESS_CODE || '',
            currency: 'INR',
            returnUrl: process.env.BASE_URL + '/api/bookings/payment/success',
            cancelUrl: process.env.BASE_URL + '/api/bookings/payment/cancel'
        });
        // Bind all methods to maintain 'this' context
        this.createBooking = this.createBooking.bind(this);
        this.getBooking = this.getBooking.bind(this);
        this.updateBooking = this.updateBooking.bind(this);
        this.deleteBooking = this.deleteBooking.bind(this);
        this.getAllBookings = this.getAllBookings.bind(this);
        this.getBookingsByUserId = this.getBookingsByUserId.bind(this);
        this.getBookingsByUserToken = this.getBookingsByUserToken.bind(this);
        this.getCountOfBookings = this.getCountOfBookings.bind(this);
        this.getTotalRevenue= this.getTotalRevenue.bind(this);
        this.getFailedBookings = this.getFailedBookings.bind(this);
        this.getTotalRevenue = this.getTotalRevenue.bind(this);
        this.handlePaymentSuccess = this.handlePaymentSuccess.bind(this);
        this.handlePaymentCancel = this.handlePaymentCancel.bind(this);
      
   
    }    

    // Payment methods
    private async _initiatePayment(booking: Booking): Promise<any> {
        // Compose PaymentRequest for CCAvenueService
        const paymentRequest = {
            bookingId: String(booking._id),
            amount: booking.totalPrice,
            currency: 'INR',
            redirectUrl: `${process.env.BASE_URL}/api/v1/ccavenue/payment-success`,
            cancelUrl: `${process.env.BASE_URL}/api/v1/ccavenue/payment-cancel`,
            billingDetails: {
                name: booking.fullName,
                address: booking.specialRequest || '',
                city: '',
                state: '',
                country: 'India',
                zip: '',
                email: booking.email,
                phone: booking.phone
            }
        };
        return await this.ccavenueService.initiatePayment(paymentRequest);
    }

    async handlePaymentSuccess(req: Request, res: Response): Promise<void> {
        try {
            // Support both POST (body) and GET (query)
            const encResp = req.body.encResp || req.query.encResp;
            let paymentResponse: any = {};
            if (encResp) {
                // Decrypt encResp using workingKey
                const crypto = require('crypto');
                const key = crypto.createHash('md5').update(this.ccavenueService['config'].workingKey).digest();
                const iv = Buffer.alloc(16, '\0');
                const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
                let decrypted = decipher.update(encResp, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                // Parse query string to object
                paymentResponse = Object.fromEntries(new URLSearchParams(decrypted));
            } else {
                paymentResponse = req.body;
            }
            // Optionally, log paymentResponse for debugging
            // console.log('Decrypted payment response:', paymentResponse);
            if (!paymentResponse.order_status || paymentResponse.order_status !== 'Success') {
                res.status(400).json({ error: 'Invalid or failed payment response', details: paymentResponse });
                return;
            }
            // Update booking status to paid
            await this.bookingService.updateBooking(paymentResponse.order_id || paymentResponse.bookingId, {
                status: 'completed',
                paymentStatus: 'confirmed'
            });
            // Return success response
            res.json({
                message: 'Payment successful',
                bookingId: paymentResponse.order_id || paymentResponse.bookingId,
                paymentStatus: 'confirmed',
                details: paymentResponse
            });
        } catch (error) {
            console.error('Payment verification error:', error);
            res.status(500).json({
                error: 'Payment verification failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async handlePaymentCancel(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body as CCAvenueResponse;
            
            // Update booking status to cancelled
            await this.bookingService.updateBooking(bookingId, { 
                status: 'canceled',
                paymentStatus: 'canceled'
            });
            
            // Return cancellation response
            res.json({ 
                message: 'Payment cancelled',
                bookingId,
                paymentStatus: 'canceled'
            });
        } catch (error) {
            console.error('Payment cancellation error:', error);
            res.status(500).json({ 
                error: 'Payment cancellation failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    async createBooking(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { paymentMethod, ...bookingBody } = req.body as {
                paymentMethod: PaymentMethod;
                [key: string]: any;
            };

            let userId = undefined;
            if (req.user && !req.body.isGuest) {
                userId = req.user._id.toString();
                console.log('User authenticated, userId set to:', userId);
            } else {
                console.log('User not authenticated or is guest');
            }

            console.log('Creating booking with userId:', userId);
            console.log(req.body);

            // Only assign userId if isGuest is false and req.user exists
            const isGuest = !req.user;
            const bookingData = {
                ...bookingBody,
                ...(isGuest ? {} : { userId: req.user ? req.user._id.toString() : undefined }),
                noOfGuests: {
                    adults: parseInt(bookingBody.noOfGuests.adults),
                    children: parseInt(bookingBody.noOfGuests.children || 0)
                },
                noOfRooms: parseInt(bookingBody.noOfRooms),
                totalPrice: parseFloat(bookingBody.totalPrice),
                status: 'pending',
                paymentStatus: paymentMethod === 'pay-later' ? 'pending' : 'pending',
                isGuest
            };

            // Explicit required field checks
            if (!bookingBody.roomId) {
                res.status(400).json({ error: 'Missing required field: roomId' });
                return;
            }
            if (!bookingBody.checkInDate) {
                res.status(400).json({ error: 'Missing required field: checkInDate' });
                return;
            }
            if (!bookingBody.checkOutDate) {
                res.status(400).json({ error: 'Missing required field: checkOutDate' });
                return;
            }
            if (!bookingBody.fullName) {
                res.status(400).json({ error: 'Missing required field: fullName' });
                return;
            }
            if (!bookingBody.email) {
                res.status(400).json({ error: 'Missing required field: email' });
                return;
            }
            if (!bookingBody.phone) {
                res.status(400).json({ error: 'Missing required field: phone' });
                return;
            }
            if (!bookingBody.noOfGuests) {
                res.status(400).json({ error: 'Missing required field: noOfGuests' });
                return;
            }
            if (!bookingBody.noOfRooms) {
                res.status(400).json({ error: 'Missing required field: noOfRooms' });
                return;
            }
            if (!bookingBody.totalPrice) {
                res.status(400).json({ error: 'Missing required field: totalPrice' });
                return;
            }

            const booking = await this.bookingService.createBooking(bookingData as Partial<Booking>);

            if (paymentMethod === 'ccavenue') {
                const paymentResponse = await this._initiatePayment(booking);
                res.json({
                    booking,
                    payment: paymentResponse,
                    paymentMethod: 'ccavenue',
                });
            } else {
                res.json({
                    booking,
                    paymentMethod: 'pay-later'
                });
            }
        } catch (error) {
            console.error('Booking creation error:', error);
            res.status(500).json({ error: 'Booking creation failed' });
        }
    };

    async getBooking(req: AuthRequest, res: Response): Promise<void> {
       
   
        if (req.user.role == 'user') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }
        try {
            const booking = await this.bookingService.getBooking(req.params.id);
            if (!booking) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json(booking);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async updateBooking(req: AuthRequest, res: Response): Promise<void> {
 
            if (req.user.role == 'user'){
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }
        try {
            const booking = await this.bookingService.updateBooking(req.params.id, req.body);
            if (!booking) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json({booking,message:"Booking updated successfully"});
        } catch (error: unknown) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
        
          if (req.user.role == 'user') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }
        try {
            const deleted = await this.bookingService.deleteBooking(req.params.id);
            if (!deleted) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json({ message: 'Booking deleted' });
        } catch (error: unknown) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }    async getAllBookings(req: AuthRequest, res: Response): Promise<void> {
        console.log(req.user.role)
         if (req.user.role == 'user') {
            res.status(403).json({ error: 'Forbidden: Admins only' });
            return;
        }

        try {
            const bookings = await this.bookingService.getAllBookings();
            res.json({
                status: 'success',
                data: bookings,
                message: 'All bookings retrieved successfully'
            });
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }


    }

    async getBookingsByUserId(req: AuthRequest, res: Response): Promise<void> {

        try {
            const bookings = await this.bookingService.getBookingsByUserId(req.params.userId);
            if (!bookings || bookings.length === 0) {
                res.status(404).json({ error: 'No bookings found for this user' });
                return;
            }
            res.json(bookings);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }   
    
    
    async getBookingsByUserToken(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            
            console.log('User object:', req.user);
            console.log('User ID type:', typeof req.user._id);
            console.log('User ID:', req.user._id);
            
            const Booking = (await import('../models/bookingModel')).default;
            const Room = (await import('../models/Room')).default;
            // const User = (await import('../models/User')).default;
            
            const bookings = await Booking.find({ 
                $or: [
                    { userId: req.user._id },
                    { userId: req.user._id.toString() }
                ] 
            });
            
            console.log('Query result:', bookings);
            if (!bookings || bookings.length === 0) {
                res.status(404).json({ error: 'No bookings found for this user' });
                return;
            }
           
            const detailedBookings = await Promise.all(bookings.map(async (booking: any) => {
                const room = await Room.findById(booking.roomId);
                // const user = await User.findById(booking.userId);
                return {
                    booking,
                    room,
                    // user
                };
            }));
            res.json(detailedBookings);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }


    async getCountOfBookings(req: AuthRequest, res: Response): Promise<void> {
        try {
                if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
            
            const count = await this.bookingService.getCountOfBookings();
            res.json({ count });
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async getTotalRevenue(req: AuthRequest, res: Response): Promise<void> {
        try {
              if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
            
            const totalRevenue = await this.bookingService.getTotalRevenue();
            res.json({ totalRevenue });
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    async getFailedBookings(req: AuthRequest, res: Response): Promise<void> {
        try {
             if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
            
            const failedBookings = await this.bookingService.getFailedBookings();
            res.json({
                status: 'success',
                data: failedBookings,
                message: 'Failed bookings retrieved successfully'
            });
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }
    
}