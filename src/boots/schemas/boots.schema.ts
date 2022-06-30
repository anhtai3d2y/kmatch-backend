import * as mongoose from 'mongoose';

export const bootsSchema = new mongoose.Schema(
  {
    userId: String,
    amount: Number,
  },
  { timestamps: true, versionKey: false },
);
