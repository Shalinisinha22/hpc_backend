import express, { Response, NextFunction, RequestHandler } from 'express';
import { PackageController } from '../controllers/packageController';
import { auth, roleAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const packageController = new PackageController();

const allowedRoles = ['admin', 'Front Office', 'HR'];

// Helper to wrap async route handlers and catch errors
function asyncHandler(fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  };
}

router.post('/', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await packageController.createPackage(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/', auth, async (req, res, next) => {
  try {
    await packageController.getPackages(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    await packageController.getPackageById(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await packageController.updatePackage(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, roleAuth(allowedRoles), async (req, res, next) => {
  try {
    await packageController.deletePackage(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;