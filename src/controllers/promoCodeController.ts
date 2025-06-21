import { Response } from 'express';
import PromoCodeService from '../services/promoCodeService';
import { AuthRequest } from '../middleware/auth';

export class PromoCodeController {
  private promoCodeService: PromoCodeService;

  constructor() {
    this.promoCodeService = new PromoCodeService();
  }

  createPromoCode = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received promo code data:', req.body);
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      // Parse and validate the data
      const promoCodeData = {
        ...req.body,
        discount: parseFloat(req.body.discount),
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date)
      };

      // Validate required fields
      if (!promoCodeData.promo_code || !promoCodeData.room_id || !promoCodeData.discount) {
        res.status(400).json({ 
          error: 'Missing required fields: promo_code, room_id, and discount are required',
          success: false 
        });
        return;
      }

      // Validate date range
      if (promoCodeData.start_date >= promoCodeData.end_date) {
        res.status(400).json({ 
          error: 'End date must be after start date',
          success: false 
        });
        return;
      }

      const promoCode = await this.promoCodeService.createPromoCode(promoCodeData);
      res.status(201).json({
        promoCode, 
        message: 'Promo code created successfully',
        success: true
      });
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to create promo code',
        success: false 
      });
    }
  };

  getPromoCodes = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const promoCodes = await this.promoCodeService.getAllPromoCodes();
      res.json(promoCodes);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getPromoCodeById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const promoCode = await this.promoCodeService.getPromoCodeById(req.params.id);
      if (!promoCode) {
        res.status(404).json({ error: 'Promo code not found' });
        return;
      }
      res.json(promoCode);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  validatePromoCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { code, roomId } = req.body;
      if (!code || !roomId) {
        res.status(400).json({ 
          error: 'Promo code and room ID are required',
          success: false 
        });
        return;
      }

      const validation = await this.promoCodeService.validatePromoCode(code, roomId);
      res.json(validation);
      return;
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message,
        success: false 
      });
      return;
    }
  };

  updatePromoCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const promoCode = await this.promoCodeService.updatePromoCode(req.params.id, req.body);
      if (!promoCode) {
        res.status(404).json({ error: 'Promo code not found' });
        return;
      }
      res.json({
        promoCode,
        message: "Promo code updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deletePromoCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const deleted = await this.promoCodeService.deletePromoCode(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Promo code not found' });
        return;
      }
      res.json({ message: 'Promo code deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };
}