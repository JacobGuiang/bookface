import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './controllers/authRouter';
import userRouter from './controllers/userRouter';
import friendRequestRouter from './controllers/friendRequestsRouter';
import postRouter from './controllers/postRouter';
import commentRouter from './controllers/commentRouter';
import middleware from './utils/middleware';
import config from './utils/config';

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connection to MongoDB:', error.message);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use(middleware.userExtractor);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/friendRequests', friendRequestRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use(middleware.errorHandler);

export default app;
