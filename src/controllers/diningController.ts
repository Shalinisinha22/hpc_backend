import { Response } from 'express';
import DiningService from '../services/diningService';
import { AuthRequest } from '../middleware/auth';

export class DiningController {
  private diningService: DiningService;

  constructor() {
    this.diningService = new DiningService();
  }

  createDining = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received dining data:', req.body);
    try {
      const dining = await this.diningService.createDining(req.body);
      res.status(201).json({ dining, message: 'Dining created successfully', success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create dining', success: false });
    }
  };

  getAllDining = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const dining = await this.diningService.getAllDining();
      res.json(dining);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getDiningById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const dining = await this.diningService.getDiningById(req.params.id);
      if (!dining) {
        res.status(404).json({ error: 'Dining not found' });
        return;
      }
      res.json(dining);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateDining = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const dining = await this.diningService.updateDining(req.params.id, req.body);
      if (!dining) {
        res.status(404).json({ error: 'Dining not found' });
        return;
      }
      res.json({ dining, message: 'Dining updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteDining = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.diningService.deleteDining(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Dining not found' });
        return;
      }
      res.json({ message: 'Dining deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  addDiningImage = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received image data:', req.body.images);
    try {
      if (!req.body || !Array.isArray(req.body.images) || req.body.images.length === 0) {
        res.status(400).json({ error: 'No image data provided' });
        return;
      }
      const diningId = req.params.id;
      // Add all images in the array
      const updatedDining = await this.diningService.addDiningImages(diningId, req.body.images);
      if (!updatedDining) {
        res.status(404).json({ error: 'Dining not found' });
        return;
      }
      res.json({ dining: updatedDining, message: 'Images added successfully', success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to add dining images', success: false });
    }
  };

  deleteDiningImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const diningId = req.params.id;
      const imageId = req.params.imgId;
      if (!imageId) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }
      const updatedDining = await this.diningService.deleteDiningImage(diningId, imageId);
      if (!updatedDining) {
        res.status(404).json({ error: 'Dining not found' });
        return;
      }
      res.json({ dining: updatedDining, message: 'Image deleted successfully', success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete dining image', success: false });
    }
  };
}
