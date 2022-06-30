import * as mongoose from 'mongoose';
import { Package } from 'utils/constants/enum/package.enum';
import { PackageType } from 'utils/constants/enum/packageType.enum';
export const paypalSchema = new mongoose.Schema(
  {
    userId: String,
    type: { type: String, enum: PackageType },
    package: { type: String, enum: Package },
    price: String,
    paymentId: String,
    token: String,
    isCompleted: Boolean,
  },
  { timestamps: true, versionKey: false },
);
