import * as mongoose from 'mongoose';

export const matchesSchema = new mongoose.Schema(
  {
    userId: String,
    otherUserId: String,
  },
  { timestamps: true, versionKey: false },
);
