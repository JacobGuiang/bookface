import mongoose from 'mongoose';
import { UserModel } from '../utils/types';

const schema = new mongoose.Schema<UserModel>({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
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

const User = mongoose.model<UserModel>('User', schema);
export default User;
