import mongoose, { Schema } from 'mongoose';
import { Comment } from '../types/types';

const schema = new mongoose.Schema<Comment>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Comment = mongoose.model<Comment>('Comment', schema);
export default Comment;
