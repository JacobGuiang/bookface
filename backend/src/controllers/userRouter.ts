import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import validator from 'validator';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password, name } = req.body;
  const { firstName, lastName } = name;

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({
      error: 'missing username, password, first name, or last name',
    });
  }
  if (!validator.isAlphanumeric(username, undefined, { ignore: '_.' })) {
    return res.status(400).json({
      error:
        'username can only contain letters, underscores (_), and periods (.)',
    });
  }
  if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    return res.status(400).json({
      error: 'first name and last name can only contains letters',
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
  const user = new User({ username, passwordHash, name });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

export default router;
