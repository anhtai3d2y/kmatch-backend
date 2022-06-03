import * as mongoose from 'mongoose';
import { Role } from 'utils/constants/enum/role.enum';
export const paypalSchema = new mongoose.Schema(
  {
    userId: String,
    package: { type: String, enum: Role },
    price: String,
    paymentId: String,
    token: String,
  },
  { timestamps: true, versionKey: false },
);
