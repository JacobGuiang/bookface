import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import validator from 'validator';

const router = express.Router();

router.get('/loggedInUser', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'not logged in' });
  }
  const user = await User.findById(req.user.id);
  res.json(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'missing username or password',
    });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: 'password is not strong' });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ error: 'username already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

export default router;
