import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/database';


import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoCodeRoutes from "./routes/promoCodesRoutes"
import eventRoutes from './routes/eventRoutes';
import hallRoutes from './routes/hallRoutes';
import offerRoutes from './routes/offerRoutes';
import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

connectDB();


app.use(express.json());
app.use(logger);


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);


app.use('/api/v1/halls', hallRoutes);


app.use('/api/v1/promocodes', promoCodeRoutes);


app.use('/api/v1/events', eventRoutes);



app.use('/api/v1/offers', offerRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
