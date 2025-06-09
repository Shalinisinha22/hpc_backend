import { Request, Response, NextFunction } from 'express';
import offerService from '../services/offerService';

export const createOffer = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
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

export const updateOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedOffer = await offerService.updateOffer(id, req.body);
    res.status(200).json({ success: true, data: updatedOffer });
  } catch (error) {
    next(error);
  }
}
export const deleteOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await offerService.deleteOffer(id);
    res.status(204).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    next(error);
  }
}
