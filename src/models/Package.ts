import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  cdate: {
    type: Date,
    default: Date.now
  }
});

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

export default Package;