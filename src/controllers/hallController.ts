import { Request, Response } from 'express';
import HallService from '../services/hallService';

export const createHall = async (req: Request, res: Response): Promise<void> => {
  try {
    const hallData = req.body;
    const newHall = await HallService.createHall(hallData);
    res.status(201).json({ success: true, data: newHall });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllHalls = async (_req: Request, res: Response): Promise<void> => {
  try {
    const halls = await HallService.getAllHalls();
    res.status(200).json({ success: true, data: halls });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getHallById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hallId = req.params.id;
    const hall = await HallService.getHallById(hallId);
    if (!hall) {
      res.status(404).json({ success: false, message: 'Hall not found' });
      return;
    }
    res.status(200).json({ success: true, data: hall });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
export const updateHall = async (req: Request, res: Response): Promise<void> => {
  try {
    const hallId = req.params.id;
    const updatedHall = await HallService.updateHall(hallId, req.body);
    if (!updatedHall) {
      res.status(404).json({ success: false, message: 'Hall not found' });
      return;
    }
    res.status(200).json({ success: true, data: updatedHall });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export const deleteHall = async (req: Request, res: Response): Promise<void> => {
  try {
    const hallId = req.params.id;
    const deletedHall = await HallService.deleteHall(hallId);
    if (!deletedHall) {
      res.status(404).json({ success: false, message: 'Hall not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Hall deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
} 
