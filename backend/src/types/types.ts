import { Date, Types } from 'mongoose';

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
  posts: Types.ObjectId[];
}

export interface Post {
  content: {
    text: string;
    // IMAGE TODO
  };
  author: Types.ObjectId;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  date: Date;
}

export interface Comment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  date: Date;
}

export interface Token {
  id: Types.ObjectId;
  name: name;
}
