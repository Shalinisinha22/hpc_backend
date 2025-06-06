import { Request, Response, NextFunction } from 'express';
import { RoomAvailabilityService } from '../services/roomAvailabilityService';

const roomAvailabilityService = new RoomAvailabilityService();

export const getAvailableRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Fetching available rooms...');
    const rooms = await roomAvailabilityService.getAvailableRooms();
    console.log('Available rooms:', rooms);
    
    if (!rooms || rooms.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No available rooms found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

export const setRoomUnavailability = async (
  req: Request,
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const result = await roomAvailabilityService.setRoomUnavailability(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};