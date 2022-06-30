export interface Paypal extends Document {
  userId: string;
  type: string;
  package: string;
  price: string;
  paymentId: string;
  token: string;
  PayerID: string;
  isCompleted: boolean;
}
