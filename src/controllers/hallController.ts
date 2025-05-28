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

