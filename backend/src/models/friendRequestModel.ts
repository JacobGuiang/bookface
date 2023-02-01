import mongoose, { Schema } from 'mongoose';
import { FriendRequest } from '../types/types';

const schema = new mongoose.Schema<FriendRequest>({
  fromId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  toId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  fromName: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
  },
  toName: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const FriendRequest = mongoose.model<FriendRequest>('FriendRequest', schema);
export default FriendRequest;
