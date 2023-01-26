import { Types } from 'mongoose';

export interface User {
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

export interface Token {
  id: Types.ObjectId;
}
