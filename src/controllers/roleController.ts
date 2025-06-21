import { Request, Response } from 'express';
import * as roleService from '../services/roleService';
import { AuthRequest } from '../middleware/auth';

export const createRole = async (req: AuthRequest, res: Response) => {
  const { role } = req.body;
  if (!role || typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ message: 'Role name is required and must be a non-empty string.' });
  }
  try {
      if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
    const newRole = await roleService.createRole(req.body);
    console.log('New role created:', newRole);
    res.status(201).json(newRole);
  } catch (error: any) {
    console.log('Error creating role:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getRoles = async (req: AuthRequest, res: Response) => {
  try {
      if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
    const roles = await roleService.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoleById = async (req: AuthRequest, res: Response) => {
  try {
      if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
      if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
    const role = await roleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRole = async (req: AuthRequest, res: Response) => {
  try {
      if (req.user.role == 'user') {
                res.status(403).json({ error: 'Forbidden: Admins only' });
                return;
            }
    const role = await roleService.deleteRole(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
