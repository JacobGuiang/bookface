import { Types } from 'mongoose';

export interface IUser {
  username: string;
  passwordHash: string;
}

export interface IToken {
  id: Types.ObjectId;
}
