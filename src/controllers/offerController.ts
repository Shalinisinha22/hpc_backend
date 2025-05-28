import { Request, Response, NextFunction } from 'express';
import offerService from '../services/offerService';

export const createOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

export const getAllOffers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const offers = await offerService.getAllOffers();
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
};
