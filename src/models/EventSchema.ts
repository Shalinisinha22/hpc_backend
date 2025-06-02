import mongoose from "mongoose";

const otherImageSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  name: {
    type: String,
  },
  ext: {
    type: String,
  },
});

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
  },
  short_intro: {
    type: String,
    required: true,
  },

  main_img: {
    name: String,
    url: String,
    ext: String,
  },
  otherImage: [otherImageSchema],

  terms: {
    type: String,
    trim: true,
  },
  desc: {
    type: String,
    trim: true,
  },

  published: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  cdate: {
    type: Date,
    default: Date.now,
  },
});

const event = mongoose.models.event || mongoose.model("event", eventSchema);

export default event;
