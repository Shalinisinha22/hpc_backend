import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/database';

import cors from 'cors'
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoCodeRoutes from "./routes/promoCodesRoutes"
import eventRoutes from './routes/eventRoutes';
import hallRoutes from './routes/hallRoutes';
import offerRoutes from './routes/offerRoutes';
import packageRoutes from './routes/packageRoutes';
import eventBookingRoutes from './routes/eventBookingRoutes';
import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

connectDB();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://yourdomain.com',
        'https://www.yourdomain.com'
      ]
    : [ 
         'http://192.168.233.1:3000',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
};



app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(express.json());
app.use(logger);


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);


app.use('/api/v1/halls', hallRoutes);


app.use('/api/v1/promocodes', promoCodeRoutes);


app.use('/api/v1/events', eventRoutes);



app.use('/api/v1/offers', offerRoutes);

app.use('/api/v1/packages', packageRoutes);

app.use('/api/v1/event-bookings', eventBookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
