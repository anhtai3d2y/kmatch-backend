export interface Paypal extends Document {
  userId: String;
  package: String;
  price: String;
  paymentId: String;
  token: String;
  PayerID: String;
}
