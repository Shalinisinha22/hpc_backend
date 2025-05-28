import { Request, Response, NextFunction } from 'express';
import promoCodeService from '../services/promoCodeService';

export const createPromoCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promoCode = await promoCodeService.createPromoCode(req.body);
    res.status(201).json({ success: true, data: promoCode });
  } catch (error) {
    next(error);
  }
};
