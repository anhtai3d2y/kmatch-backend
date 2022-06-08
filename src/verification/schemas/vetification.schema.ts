import * as mongoose from 'mongoose';

export const verificationSchema = new mongoose.Schema(
  {
    email: String,
    verification: {
      code: { type: String },
      timeOut: { type: Number },
    },
  },
  { timestamps: true, versionKey: false },
);
