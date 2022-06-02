import * as mongoose from 'mongoose';
import { MessageType } from 'utils/constants/enum/messageType.enum';
export const messagesSchema = new mongoose.Schema(
  {
    threadId: String,
    senderId: String,
    receiverId: String,
    messageType: { type: String, enum: MessageType, default: MessageType.Text },
    messageBody: String,
  },
  { timestamps: true, versionKey: false },
);
