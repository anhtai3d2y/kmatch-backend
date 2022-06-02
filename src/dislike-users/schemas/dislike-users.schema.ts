import * as mongoose from 'mongoose';

export const dislikeUsersSchema = new mongoose.Schema(
  {
    userId: String,
    userDislikedId: String,
  },
  { timestamps: true, versionKey: false },
);
