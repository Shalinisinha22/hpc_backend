import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { Request, Response } from 'express';

const router = Router();
const bookingController = new BookingController();

// Payment initiation route (NOT SUPPORTED DIRECTLY - use bookingController.createBooking for payment initiation)
router.post('/initiate-payment', (req: Request, res: Response) => {
    res.status(400).json({ error: 'Direct payment initiation is not supported. Please use the booking creation endpoint to initiate payment.' });
});

// Payment success callback route (support both POST and GET, handle encResp)
router.post('/payment-success', (req: Request, res: Response) => 
    bookingController.handlePaymentSuccess(req, res));
router.get('/payment-success', (req: Request, res: Response) => 
    bookingController.handlePaymentSuccess(req, res));

// Payment cancellation callback route (support both POST and GET, handle encResp)
router.post('/payment-cancel', (req: Request, res: Response) => 
    bookingController.handlePaymentCancel(req, res));
router.get('/payment-cancel', (req: Request, res: Response) => 
    bookingController.handlePaymentCancel(req, res));

export default router;
