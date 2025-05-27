import mongoose from "mongoose";

const otherImageSchema = new mongoose.Schema({
  url: {
    type: String

  },
  name: {
    type: String

  },
  ext: {
    type: String

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
  otherImage:[otherImageSchema],

  location: {
    type: String,
    trim: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  eventColor: {
    type: String,
    default: "#1E40AF",
  },
 
  status: {
    type: String,
    enum: ["active", "cancelled", "completed"],
    default: "active",
  },
  cdate: {
    type: Date,
    default: Date.now,
  },
});

const event =
  mongoose.models.event || mongoose.model("event", eventSchema);

export default event;
