import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import loginRouter from './login/loginRouter';
import userRouter from './user/userRouter';
import { errorHandler } from './utils/middleware';
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

app.get('/ping', (req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

export default app;
