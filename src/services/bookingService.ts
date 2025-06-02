import Booking, { Booking as BookingType } from '../models/bookingModel';


interface DetailedBooking {
    confirmation: string;
    bookingId: string;
    name: string;
    email: string;
    contact: string;
    bookingDate: Date;
    paymentStatus: string;
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

    public async getBooking(userId: string) {
        return await Booking.findOne({ userId });
    }    public async getAllBookings(): Promise<DetailedBooking[]> {
        const bookings = await Booking.find()
            .select({
                bookingId: 1,
                fullName: 1,
                email: 1,
                phone: 1,
                paymentStatus: 1,
                createdAt: 1
            })
            .sort({ createdAt: -1 }); 

        return bookings.map(booking => ({
            confirmation: booking.bookingId,
            bookingId: booking.bookingId,
            name: booking.fullName,
            email: booking.email,
            contact: booking.phone,
            bookingDate: booking.createdAt,
            paymentStatus: booking.paymentStatus
        }));
    }

    public async updateBooking(bookingId: string, updatedBooking: Partial<BookingType>) {
        return await Booking.findOneAndUpdate({ bookingId }, updatedBooking, { new: true });
    }

    public async deleteBooking(bookingId: string) {
        const result = await Booking.deleteOne({ bookingId });
        return !!result.deletedCount && result.deletedCount > 0;
    }

    public async getBookingsByUserId(userId: string) {
        return await Booking.find({ userId });
    }
}