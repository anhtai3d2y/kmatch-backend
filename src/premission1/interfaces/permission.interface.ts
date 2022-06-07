import * as mongoose from 'mongoose';

export interface Permission extends mongoose.Document {
  readonly permissionName: string;
  readonly permissionCode: string;
}
