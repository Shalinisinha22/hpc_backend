import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  promo_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  discount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  }
});

const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;