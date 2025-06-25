import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { Request, Response } from 'express';

const router = Router();
const bookingController = new BookingController();

// Payment initiation route
router.post('/initiate-payment', (req: Request, res: Response) => 
    bookingController.initiatePayment(req, res));

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
