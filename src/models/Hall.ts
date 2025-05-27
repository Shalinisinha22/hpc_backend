import mongoose from 'mongoose';

const seatingSchema = new mongoose.Schema({
  theatre: Number,
  ushaped: Number,
  boardroom: Number,
  classroom: Number,
  reception: Number
});

const hallImageSchema = new mongoose.Schema({
  name: String,
  url: String,
  ext: String
});

const hallSchema = new mongoose.Schema({
  hall_name: {
    type: String,
    required: true,
    trim: true
  },
  max_capacity: {
    type: Number,
    required: true
  },
  short_intro: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  length: {
    type: Number,
    required: true
  },
  breadth: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  guest_entry_point: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  seating: seatingSchema,
  hall_image: [hallImageSchema],
  status: {
    type: String,
    enum: ['available', 'unavailable', 'maintenance'],
    default: 'available'
  },
  cdate: {
    type: Date,
    default: Date.now
  }
});

const Hall = mongoose.models.Hall || mongoose.model('Hall', hallSchema);

export default Hall;