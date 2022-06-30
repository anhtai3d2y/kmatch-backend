export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  phonenumber: string;
  permission: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  currentHashedRefreshToken: string;
  verification: {
    code: string;
    timeOut: number;
  };
}
