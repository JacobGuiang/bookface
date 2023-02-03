import { Types } from 'mongoose';

interface name {
  firstName: string;
  lastName: string;
}

export interface User {
  username: string;
  passwordHash: string;
  name: name;
  friends: Types.ObjectId[];
  friendRequestsFrom: Types.ObjectId[];
  friendRequestsTo: Types.ObjectId[];
}

export interface Token {
  id: Types.ObjectId;
  name: name;
}
