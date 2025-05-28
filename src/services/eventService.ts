import Event from '../models/EventSchema';

interface EventInput {
  event_name: string;
  short_intro: string;
  main_img: {
    name: string;
    url: string;
    ext: string;
  };
  otherImage?: {
    url: string;
    name: string;
    ext: string;
  }[];
  location?: string;
  desc?: string;
  eventColor?: string;
  status?: 'active' | 'cancelled' | 'completed';
  cdate?: Date;
}

const createEvent = async (data: EventInput) => {
  const event = new Event(data);
  return await event.save();
};

const getAllEvents = async () => {
  return await Event.find().sort({ cdate: -1 });
};

export default {
  createEvent,
  getAllEvents
};
