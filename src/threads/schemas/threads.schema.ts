import * as mongoose from 'mongoose';
export const threadsSchema = new mongoose.Schema(
  {
    userId: String,
    otherUserId: String,
  },
  { timestamps: true, versionKey: false },
);
