import { Types } from 'mongoose';

export interface User {
  username: string;
  passwordHash: string;
  name: {
    firstName: string;
    lastName: string;
  };
  friendRequests: [Types.ObjectId];
}

export interface Token {
  id: Types.ObjectId;
}
