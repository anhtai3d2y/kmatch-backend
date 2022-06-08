export interface Veritification extends Document {
  _id: string;
  email: string;
  verification: {
    code: string;
    timeOut: number;
  };
}
