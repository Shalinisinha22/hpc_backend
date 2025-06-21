import { Response } from 'express';
import { PackageService } from '../services/packageService';
import { AuthRequest } from '../middleware/auth';

export class PackageController {
  private packageService: PackageService;

  constructor() {
    this.packageService = new PackageService();
  }

  createPackage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const packageItem = await this.packageService.createPackage(req.body);
      res.status(201).json({ package: packageItem, message: 'Package created successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  getPackages = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const packages = await this.packageService.getPackages();
      res.json(packages);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  getPackageById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const packageItem = await this.packageService.getPackageById(req.params.id);
      if (!packageItem) {
        res.status(404).json({ error: 'Package not found' });
        return;
      }
      res.json(packageItem);
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  };

  updatePackage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const packageItem = await this.packageService.updatePackage(req.params.id, req.body);
      if (!packageItem) {
        res.status(404).json({ error: 'Package not found' });
        return;
      }
      res.json({ package: packageItem, message: 'Package updated successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

  deletePackage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
      const deleted = await this.packageService.deletePackage(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Package not found' });
        return;
      }
      res.json({ message: 'Package deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };
}