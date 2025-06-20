import Role, { IRole } from '../models/roleModel';

export const createRole = async (data: Partial<IRole>) => {
  // Check for duplicate role name
  const existing = await Role.findOne({ role: data.role });
  if (existing) {
    throw new Error('Role name already exists');
  }
  const role = new Role(data);
  return await role.save();
};

export const getRoles = async () => {
  return await Role.find();
};

export const getRoleById = async (id: string) => {
  return await Role.findById(id);
};

export const updateRole = async (id: string, data: Partial<IRole>) => {
  return await Role.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRole = async (id: string) => {
  return await Role.findByIdAndDelete(id);
};
