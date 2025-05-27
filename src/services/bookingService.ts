import { Booking } from '../models/bookingModel';

export class BookingService {
    private bookings: Booking[] = [];

    public createBooking(booking: Booking): Booking {
        this.bookings.push(booking);
        return booking;
    }

    public getBooking(bookingId: string): Booking | undefined {
        return this.bookings.find(booking => booking.bookingId === bookingId);
    }

    public updateBooking(bookingId: string, updatedBooking: Partial<Booking>): Booking | undefined {
        const bookingIndex = this.bookings.findIndex(booking => booking.bookingId === bookingId);
        if (bookingIndex !== -1) {
            this.bookings[bookingIndex] = { ...this.bookings[bookingIndex], ...updatedBooking };
            return this.bookings[bookingIndex];
        }
        return undefined;
    }

    public deleteBooking(bookingId: string): boolean {
        const bookingIndex = this.bookings.findIndex(booking => booking.bookingId === bookingId);
        if (bookingIndex !== -1) {
            this.bookings.splice(bookingIndex, 1);
            return true;
        }
        return false;
    }
}