import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import loginRouter from './controllers/loginRouter';
import logoutRouter from './controllers/logoutRouter';
import userRouter from './controllers/userRouter';
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
app.use(express.json());
app.use(cookieParser());

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use(middleware.userExtractor);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/users', userRouter);
app.use(middleware.errorHandler);

export default app;
