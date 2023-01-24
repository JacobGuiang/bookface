import express from 'express';
import bcrypt from 'bcrypt';
import User from '../user/userModel';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User(username, passwordHash);
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

export default router;
