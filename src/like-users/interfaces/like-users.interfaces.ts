export interface LikeUsers extends Document {
  _id: string;
  userId: string;
  userLikedId: string;
}
