import { stat } from 'fs';
import Booking, { Booking as BookingType } from '../models/bookingModel';


interface DetailedBooking {
    bookingId: string;
    name: string;
    email: string;
    contact: string;
    bookingDate: Date;
    paymentStatus: string;
    status: string;
}

export class BookingService {    
    public async createBooking(booking: Partial<BookingType>) {
        try {
            const timestamp = new Date().getTime();
            const bookingId = `BK-${timestamp}-${Math.random().toString(36).substr(2, 6)}`;
            
 
            const bookingData = {
                ...booking,
                bookingId
            };

            console.log('Creating booking with userId:', booking.userId);
            console.log('Booking data:', bookingData);
            
            const newBooking = new Booking(bookingData);
            await newBooking.save();
        
            if (booking.userId) {
                const User = (await import('../models/User')).default;
                await User.findByIdAndUpdate(
                    booking.userId,
                    { $push: { bookingIds: bookingId } },
                    { new: true }
                );
            }
            
            return newBooking;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }

    public async getBooking(id: string) {
        try {
            console.log('BookingService: getBooking called with id:', id);
            
            // Try to find by custom bookingId first
            let booking = await Booking.findOne({ bookingId: id });
            
            // If not found and id looks like MongoDB ObjectId, try finding by _id
            if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
                booking = await Booking.findById(id);
            }
            
            console.log('BookingService: Found booking:', booking ? 'Yes' : 'No');
            return booking;
        } catch (error) {
            console.error('Error in BookingService.getBooking:', error);
            throw error;
        }
    }

    public async getAllBookings(): Promise<DetailedBooking[]> {
        const bookings = await Booking.find()
            .select({
                bookingId: 1,
                fullName: 1,
                email: 1,
                phone: 1,
                paymentStatus: 1,
                status: 1,
                createdAt: 1
            })
            .sort({ createdAt: -1 }); 

        return bookings.map(booking => ({
            bookingId: booking.bookingId,
            name: booking.fullName,
            email: booking.email,
            contact: booking.phone,
            bookingDate: booking.createdAt,
            paymentStatus: booking.paymentStatus,
            status: booking.status || ''
        }));
    }

    public async updateBooking(id: string, updatedBooking: Partial<BookingType>) {
        // Try to find by custom bookingId first
        let booking = await Booking.findOneAndUpdate({ bookingId: id }, updatedBooking, { new: true });
        
        // If not found and id looks like MongoDB ObjectId, try finding by _id
        if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
            booking = await Booking.findByIdAndUpdate(id, updatedBooking, { new: true });
        }
        
        return booking;
    }

    public async deleteBooking(id: string) {
        // Try to delete by custom bookingId first
        let result = await Booking.deleteOne({ bookingId: id });
        // If not found and id looks like MongoDB ObjectId, try deleting by _id
        if (result.deletedCount === 0 && id.match(/^[0-9a-fA-F]{24}$/)) {
            const doc = await Booking.findByIdAndDelete(id);
            return doc ? { acknowledged: true, deletedCount: 1 } : { acknowledged: false, deletedCount: 0 };
        }
        return result;
    }

    public async getBookingsByUserId(userId: string) {
        return await Booking.find({ userId });
    }

    public async getCountOfBookings(): Promise<number> {
        try {
            const count = await Booking.countDocuments({ paymentStatus: { $ne: 'cancelled' } });
            console.log('Total bookings count (excluding cancelled):', count);
            return count;
        } catch (error) {
            console.error('Error fetching bookings count:', error);
            throw error;
        }
    }

    public async getFailedBookings(): Promise<BookingType[]> {
        try {
            const failedBookings = await Booking.find({ paymentStatus: 'failed' , status: 'canceled' });
            return failedBookings;
        } catch (error) {
            console.error('Error fetching failed bookings:', error);
            throw error;
        }
    }
    public async getTotalRevenue(): Promise<number> {
        try {
            const bookings = await Booking.find({  paymentStatus: { $ne: 'cancelled' }, status  : { $ne: 'canceled' } });
            const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
            return totalRevenue;
        } catch (error) {
            console.error('Error calculating total revenue:', error);
            throw error;
        }
    }
}