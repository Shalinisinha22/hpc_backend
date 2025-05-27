import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  offer_name: {
    type: String,
    required: true,
    trim: true
  },
  offer_rate_code: {
    type: String,
    required: true,
    unique: true
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
  terms: {
    type: String,
    trim: true
  },
  email_text: {
    type: String,
    trim: true
  },
  image: {
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
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  cdate: {
    type: Date,
    default: Date.now
  }
});

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

export default Offer;