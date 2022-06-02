export interface SuperlikeUsers extends Document {
  _id: string;
  userId: string;
  userSuperlikedId: string;
}
