import mongoose from 'mongoose';

const roomImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  ext: {
    type: String,
    required: true
  }
});

const roomSchema = new mongoose.Schema({
  roomImage: [roomImageSchema],
  room_title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  max_person: {
    type: Number,
    required: true
  },
  max_children: {
    type: Number,
    required: true
  },
  totalRooms: {
    type: Number,
    required: true
  },
  roomSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  cdate: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;