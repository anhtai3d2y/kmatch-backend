export interface DislikeUsers extends Document {
  _id: string;
  userId: string;
  userDislikedId: string;
}
