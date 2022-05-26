import * as mongoose from 'mongoose';
import { AdminRole } from '../../../utils/constants/enum/adminRole.enum';
export const groupPermissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      require: true,
      enum: AdminRole,
      unique: true,
    },
    additional: { type: String, default: '' },
    permissionId: { type: Array, default: [] },
  },
  { timestamps: true, versionKey: false },
);
