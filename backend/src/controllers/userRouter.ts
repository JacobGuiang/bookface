import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import validator from 'validator';

const router = express.Router();

router.get('/', async (_req, res) => {
  const users = await User.find({}, 'name');
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.get('/:id/friends', async (req, res) => {
  const user = await User.findById(
    req.params.id,
    'friends friendRequestsFrom friendRequestsTo'
  )
    .populate('friends', 'name')
    .populate('friendRequestsFrom', 'name')
    .populate('friendRequestsTo', 'name');
  res.json(user);
});

router.get('/:id/posts', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate('posts', '-author');

  if (!user) {
    return res.status(400).json({ error: `invalid user id: ${userId}` });
  }

  res.json(user.posts);
});

router.get('/:id/feed', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ error: `invalid user id: ${userId}` });
  }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  const friend = await User.findById(req.params.friendId);

  if (!user || !friend) {
    return res.status(400).json({ error: 'invalid ids' });
  }

  user.friends = user.friends.filter((_id) => !_id.equals(friend._id));
  friend.friends = friend.friends.filter((_id) => !_id.equals(user._id));

  await user.save();
  await friend.save();

  res.status(204).end();
});

router.post('/', async (req, res) => {
  let { username } = req.body;
  const { name, password } = req.body;
  const { firstName, lastName } = name;

  username = username.toLowerCase();
  name.firstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  name.lastName =
    lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({
      error: 'missing username, password, first name, or last name',
    });
  }
  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({
      error: 'username can only contain letters and numbers',
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

export default router;
