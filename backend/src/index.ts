import express from 'express';
import loginRouter from './login/loginRouter';
import userRouter from './user/userRouter';
import { errorHandler } from './utils/middleware';
import { PORT } from './utils/config';

const app = express();
app.use(express.json());

app.get('/ping', (req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/login', loginRouter);
app.use('/api/user', userRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
