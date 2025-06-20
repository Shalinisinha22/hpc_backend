import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  role: string;
  description?: string;
  permissions: string[];
}

const RoleSchema: Schema = new Schema({
  role: { type: String, unique: true, required: true },
  description: { type: String },
  permissions: [{ type: String }]
});

export default mongoose.model<IRole>('Role', RoleSchema);
