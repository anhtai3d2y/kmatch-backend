import * as mongoose from 'mongoose';

export const superlikeStarSchema = new mongoose.Schema(
  {
    userId: String,
    amount: Number,
  },
  { timestamps: true, versionKey: false },
);
