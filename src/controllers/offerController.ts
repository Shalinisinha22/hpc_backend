import { Response } from 'express';
import OfferService from '../services/offerService';
import { AuthRequest } from '../middleware/auth';

export class OfferController {
  private offerService: OfferService;

  constructor() {
    this.offerService = new OfferService();
  }

  createOffer = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received offer data:', req.body);
    try {
      // Parse and validate the data
      const offerData = {
        ...req.body,
        image: typeof req.body.image === 'string' 
          ? JSON.parse(req.body.image) 
          : req.body.image
      };

      // Validate required fields
      if (!offerData.offer_name || !offerData.offer_rate_code || !offerData.short_intro) {
        res.status(400).json({ 
          error: 'Missing required fields: offer_name, offer_rate_code, and short_intro are required',
          success: false 
        });
        return;
      }

      const offer = await this.offerService.createOffer(offerData);
      res.status(201).json({
        offer, 
        message: 'Offer created successfully',
        success: true
      });
    } catch (error: any) {
      console.error('Error creating offer:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to create offer',
        success: false 
      });
    }
  };

  getOffers = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const offers = await this.offerService.getAllOffers();
      res.json(offers);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getOfferById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const offer = await this.offerService.getOfferById(req.params.id);
      if (!offer) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }
      res.json(offer);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updateOffer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const offer = await this.offerService.updateOffer(req.params.id, req.body);
      if (!offer) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }
      res.json({
        offer,
        message: "Offer updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deleteOffer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.offerService.deleteOffer(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }
      res.json({ message: 'Offer deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };
}