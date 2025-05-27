import { Router } from 'express';
import BookingController from '../controllers/bookingController';

const router = Router();
const bookingController = new BookingController();

const setBookingRoutes = (app) => {
    router.post('/bookings', bookingController.createBooking);
    router.get('/bookings/:id', bookingController.getBooking);
    router.put('/bookings/:id', bookingController.updateBooking);
    router.delete('/bookings/:id', bookingController.deleteBooking);

    app.use('/api', router);
};

export default setBookingRoutes;