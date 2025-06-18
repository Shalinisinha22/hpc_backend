import { Response } from 'express';
import HallService from '../services/hallService';
import { AuthRequest } from '../middleware/auth';

export class HallController {
  private hallService: HallService;

  constructor() {
    this.hallService = new HallService();
  }

  createHall = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('Received hall data:', req.body);
    try {
      // Parse and validate the data
      const hallData = {
        ...req.body,
        max_capacity: parseInt(req.body.max_capacity) || req.body.max_capacity,
        length: parseFloat(req.body.length) || req.body.length,
        breadth: parseFloat(req.body.breadth) || req.body.breadth,
        height: parseFloat(req.body.height) || req.body.height,
        area: parseFloat(req.body.area) || req.body.area,
        hall_image: typeof req.body.hall_image === 'string' 
          ? JSON.parse(req.body.hall_image) 
          : req.body.hall_image
      };

      // Validate required fields
      if (!hallData.hall_name || !hallData.max_capacity || !hallData.short_intro || !hallData.length || !hallData.breadth || !hallData.height || !hallData.area) {
        res.status(400).json({ 
          error: 'Missing required fields: hall_name, max_capacity, short_intro, length, breadth, height, and area are required',
          success: false 
        });
        return;
      }

      const hall = await this.hallService.createHall(hallData);
      res.status(201).json({
        hall, 
        message: 'Hall created successfully',
        success: true
      });
    } catch (error: any) {
      console.error('Error creating hall:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to create hall',
        success: false 
      });
    }
  };

  getHalls = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const halls = await this.hallService.getAllHalls();
      res.json(halls);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getHallById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const hall = await this.hallService.getHallById(req.params.id);
      if (!hall) {
        res.status(404).json({ error: 'Hall not found' });
        return;
      }
      res.json(hall);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updateHall = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const hall = await this.hallService.updateHall(req.params.id, req.body);
      if (!hall) {
        res.status(404).json({ error: 'Hall not found' });
        return;
      }
      res.json({
        hall,
        message: "Hall updated successfully"
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deleteHall = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deleted = await this.hallService.deleteHall(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Hall not found' });
        return;
      }
      res.json({ message: 'Hall deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };
}