import * as mongoose from 'mongoose';

export const superlikeUsersSchema = new mongoose.Schema(
  {
    userId: String,
    userSuperlikedId: String,
  },
  { timestamps: true, versionKey: false },
);
