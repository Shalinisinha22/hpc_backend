import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import { logger } from './middlewares/loggerMiddleware';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Logger Middleware
app.use(logger);

// Routes
app.use('/api/v1/users', userRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});