export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  phonenumber: string;
  permission: string[];
  mylocation: {
    latitude: number;
    longitude: number;
  };
  boots: number;
  currentHashedRefreshToken: string;
  verification: {
    code: string;
    timeOut: number;
  };
}
