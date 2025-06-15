import Event from '../models/EventSchema';
import { Document } from 'mongoose';

interface IOtherImage {
  url: string;
  name: string;
  ext: string;
}

interface IMainImage {
  url: string;
  name: string;
  ext: string;
}

export interface IEvent extends Document {
  title?: string;
  event_name?: string;
  short_intro?: string;
  main_img?: IMainImage;
  otherImage?: IOtherImage[];
  eventImage?: IOtherImage[];
  terms?: string;
  desc?: string;
  description?: string;
  published?: boolean;
  featured?: boolean;
  cdate?: Date;
  date?: Date;
  location?: string;
  capacity?: number;
  price?: number;
}

interface EventInput {
  title?: string;
  event_name?: string;
  short_intro?: string;
  description?: string;
  main_img?: {
    name: string;
    url: string;
    ext: string;
  };
  eventImage?: {
    url: string;
    name: string;
    ext: string;
  }[];
  otherImage?: {
    url: string;
    name: string;
    ext: string;
  }[];
  terms?: string;
  desc?: string;
  published?: boolean;
  featured?: boolean;
  date?: Date;
  location?: string;
  capacity?: number;
  price?: number;
}

export class EventService {
  async createEvent(data: EventInput): Promise<IEvent> {
    try {
      const event = new Event(data);
      return await event.save();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create event');
    }
  }

  async getAllEvents(): Promise<IEvent[]> {
    try {
      return await Event.find().sort({ cdate: -1, date: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch events');
    }
  }

  async getEventById(id: string): Promise<IEvent | null> {
    try {
      const event = await Event.findById(id);
      return event;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch event');
    }
  }

  async updateEvent(id: string, data: Partial<EventInput>): Promise<IEvent | null> {
    try {
      const event = await Event.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { new: true, runValidators: true }
      );
      return event;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update event');
    }
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    try {
      const event = await Event.findByIdAndDelete(id);
      return event;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete event');
    }
  }
}

export default EventService;