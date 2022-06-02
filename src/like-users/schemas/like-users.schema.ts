import * as mongoose from 'mongoose';

export const likeUsersSchema = new mongoose.Schema(
  {
    userId: String,
    userLikedId: String,
  },
  { timestamps: true, versionKey: false },
);
