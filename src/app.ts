import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/database';

import cors from 'cors'
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';
import roomAvailabilityRoutes from './routes/roomAvailabilityRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoCodeRoutes from "./routes/promoCodesRoutes"
import eventRoutes from './routes/eventRoutes';
import hallRoutes from './routes/hallRoutes';
import offerRoutes from './routes/offerRoutes';
import packageRoutes from './routes/packageRoutes';
import eventBookingRoutes from './routes/eventBookingRoutes';
import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import roleRoutes from './routes/roleRoutes';
import diningRoutes from "./routes/diningRoutes";
import diningBookingRoutes from "./routes/diningBookingRoutes";
const app = express();

connectDB();
 // origin: process.env.NODE_ENV === 'production'
  //   ? [
  //       'https://yourdomain.com',
  //       'https://www.yourdomain.com'
  //     ]
  //   : 

const corsOptions = {
   origin:"*",
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel Booking API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      rooms: '/api/v1/rooms',
      users: '/api/v1/users',
      bookings: '/api/v1/bookings'
    }
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/room-availability', roomAvailabilityRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/halls', hallRoutes);
app.use('/api/v1/promocodes', promoCodeRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/event-bookings', eventBookingRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use("/api/v1/dining",diningRoutes);
app.use("/api/v1/dining-bookings", diningBookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
