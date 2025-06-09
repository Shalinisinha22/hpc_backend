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

export const getAllPromoCodes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const promoCodes = await promoCodeService.getAllPromoCodes();
    res.status(200).json({ success: true, data: promoCodes });
  } catch (error) {
    next(error);
  }
};
export const deletePromoCode = async (req: Request, res: Response, next: NextFunction) => {   
  try {
    const { id } = req.params;
    await promoCodeService.deletePromoCode(id);
    res.status(204).json({ success: true, message: 'Promo code deleted successfully' });
  } catch (error) {
    next(error);
  }
}
