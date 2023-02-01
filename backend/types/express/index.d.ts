import { Types } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: Types.ObjectId };
  }
}
