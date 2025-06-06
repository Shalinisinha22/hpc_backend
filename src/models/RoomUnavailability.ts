import mongoose, { Document, Schema } from 'mongoose';

export interface IRoomUnavailability extends Document {
  roomId: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  createdAt: Date;
}

const roomUnavailabilitySchema = new Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


roomUnavailabilitySchema.index({ roomId: 1, fromDate: 1, toDate: 1 });

const RoomUnavailability = mongoose.models.RoomUnavailability || 
  mongoose.model<IRoomUnavailability>('RoomUnavailability', roomUnavailabilitySchema);

export default RoomUnavailability;