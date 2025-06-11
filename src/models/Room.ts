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
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
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

  // roomView: {
  //   type: String,
  //   enum: ['City View', 'Garden View', 'Pool View', 'Ocean View', 'Mountain View'],
  //   required: true
  // },
  bedType: {
    type: String,
    enum: ['Single', 'Double', 'Queen', 'King', 'Twin'],
    required: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  additionalDetails: [{
    type: String,
    trim: true
  }],
  // Existing fields
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