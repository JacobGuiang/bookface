import { Date, Types } from 'mongoose';

interface name {
  firstName: string;
  lastName: string;
}

export interface User {
  username: string;
  passwordHash: string;
  name: name;
  friends: [Types.ObjectId];
  friendRequestsFrom: [Types.ObjectId];
  friendRequestsTo: [Types.ObjectId];
}

export interface FriendRequest {
  fromId: Types.ObjectId;
  toId: Types.ObjectId;
  fromName: name;
  toName: name;
  date: Date;
}

export interface Token {
  id: Types.ObjectId;
}
