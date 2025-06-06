import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: event, message: 'Event created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
