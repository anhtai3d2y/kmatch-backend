import { Document } from 'mongoose';
export interface GroupPermission extends Document {
  role: string;
  additional: string;
  permissionId: string[];
}
