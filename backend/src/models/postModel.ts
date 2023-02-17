import mongoose, { Schema } from 'mongoose';
import { Post } from '../types/types';

const schema = new mongoose.Schema<Post>({
  content: {
    text: {
      type: String,
      required: true,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
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

const Post = mongoose.model<Post>('Post', schema);
export default Post;
