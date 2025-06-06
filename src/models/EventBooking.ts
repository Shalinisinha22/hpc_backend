import mongoose from 'mongoose';

const eventBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  eventType: {
    type: String,
    required: true,
    enum: ['wedding', 'corporate', 'birthday', 'conference', 'seminar', 'party', 'other'],
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: false
  },
  cdate: {
    type: Date,
    default: Date.now
  }
});

const EventBooking = mongoose.models.EventBooking || mongoose.model('EventBooking', eventBookingSchema);

export default EventBooking;