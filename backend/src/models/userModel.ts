import mongoose, { Schema } from 'mongoose';
import { User } from '../types/types';

const schema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  friends: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  friendRequestsFrom: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  friendRequestsTo: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
});

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model<User>('User', schema);
export default User;
