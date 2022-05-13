import * as mongoose from 'mongoose';
import { Gender } from 'utils/constants/enum/gender.enum';

export const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      default: '',
    },
    phone: { type: String },
    role: { type: String },
    avatar: String,
    gender: { type: String, enum: Gender, default: 'male' },
    permission: { type: Array, default: [] },
    birthday: { type: String },
    currentHashedRefreshToken: String,
    verification: {
      code: { type: String },
      timeOut: { type: Number },
    },
  },
  { timestamps: true, versionKey: false },
);
