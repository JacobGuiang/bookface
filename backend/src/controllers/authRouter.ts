import express from 'express';
import config from '../utils/config';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'missing username or password',
    });
  }

  const user = await User.findOne({ username });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordCorrect) {
    return res.status(400).json({ error: 'invalid username or password' });
  }

  const userDetails = {
    id: user._id,
    username: user.username,
    name: { ...user.name },
  };

  const token = jwt.sign(userDetails, config.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 24,
  });

  res.cookie('token', token, { httpOnly: true }).json(userDetails);
});

router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.json({ loggedOut: true });
});

router.get('/current', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'not logged in' });
  }
  res.json(req.user);
});

export default router;
