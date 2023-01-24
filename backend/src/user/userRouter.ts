import express from 'express';
import bcrypt from 'bcrypt';
import User from '../user/userModel';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'missing username or password',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({ username, passwordHash });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

export default router;
