export interface Messages extends Document {
  _id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  messageType: string;
  messageBody: string;
  createdAt: string;
}
