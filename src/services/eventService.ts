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
  event_name: string;
  short_intro: string;
  main_img: IMainImage;
  otherImage: IOtherImage[];
  terms?: string;
  desc?: string;
  published?: boolean;
  featured?: boolean;
  cdate?: Date;
}

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
  terms?: string;
  desc?: string;
  published?: boolean;
  featured?: boolean;
}

export class EventService {
  async createEvent(data: EventInput): Promise<IEvent> {
    try {
      const event = new Event(data);
      return await event.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllEvents(): Promise<IEvent[]> {
    try {
      return await Event.find().sort({ cdate: -1 });
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(id: string, data: Partial<EventInput>): Promise<IEvent | null> {
    try {
      const event = await Event.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { new: true, runValidators: true }
      );
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    try {
      const event = await Event.findByIdAndDelete(id);
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  async getEventById(id: string): Promise<IEvent | null> {
    try {
      const event = await Event.findById(id);
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw error;
    }
  }
}

export default EventService;
