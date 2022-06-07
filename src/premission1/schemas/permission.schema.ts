import * as mongoose from 'mongoose';
import { ActionEnum } from '../../../utils/constants/enum/action.enum';
export const permissionSchema = new mongoose.Schema(
  {
    permissionName: {
      type: String,
      require: true,
      unique: true,
    },
    permissionCode: {
      type: String,
      // require: true,
      // unique: true,
      // enum: Object.values(ActionEnum),
    },
  },
  { timestamps: true, versionKey: false },
);
