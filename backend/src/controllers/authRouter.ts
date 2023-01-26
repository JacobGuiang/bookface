import express from 'express';
import config from '../utils/config';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/login/status', async (req, res) => {
  if (!req.user) {
    return res.json({ loggedIn: false });
  } else {
    return res.json({ loggedIn: true, user: req.user });
  }
});

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

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 24,
  });

  res.cookie('token', token, { httpOnly: true }).json(user);
});

router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.send({ loggedOut: true });
});

export default router;
