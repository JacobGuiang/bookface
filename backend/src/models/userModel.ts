import mongoose, { Types } from 'mongoose';
import { User } from '../utils/types';

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
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  friendRequests: {
    type: [Types.ObjectId],
    ref: 'User',
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
