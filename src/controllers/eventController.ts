import { Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthRequest } from '../middleware/auth';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received event data:', req.body);
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      // Parse and validate the data
      const eventData = {
        ...req.body,
        capacity: parseInt(req.body.capacity),
        price: parseFloat(req.body.price),
        eventImage: typeof req.body.eventImage === 'string' 
          ? JSON.parse(req.body.eventImage) 
          : req.body.eventImage
      };

      // Validate required fields
      if (!eventData.title || !eventData.date || !eventData.location) {
        res.status(400).json({ 
          error: 'Missing required fields: title, date, and location are required',
          success: false 
        });
        return;
      }

      const event = await this.eventService.createEvent(eventData);
      res.status(201).json({
        event, 
        message: 'Event created successfully',
        success: true
      });
    } catch (error: any) {
      console.error('Error creating event:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to create event',
        success: false 
      });
    }
  };

  getEvents = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const events = await this.eventService.getAllEvents();
      res.json(events);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json(event);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const event = await this.eventService.updateEvent(req.params.id, req.body);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json({
        event,
        message: "Event updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const deleted = await this.eventService.deleteEvent(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json({ message: 'Event deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };
}
