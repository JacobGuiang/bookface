import express from 'express';
import User from '../models/userModel';

const router = express.Router();

router.post('/', async (req, res) => {
  const { fromId, toId } = req.body;

  const fromUser = await User.findById(fromId);
  const toUser = await User.findById(toId);
  if (!fromUser || !toUser) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const _fromId = fromUser._id;
  const _toId = toUser._id;

  if (fromUser.friends.includes(_toId)) {
    return res.status(400).json({ error: `users are already friends` });
  }

  if (
    fromUser.friendRequestsTo.includes(_toId) ||
    fromUser.friendRequestsFrom.includes(_toId)
  ) {
    return res.status(400).json({
      error: `friend request already exists between users`,
    });
  }

  fromUser.friendRequestsTo.push(_toId);
  await fromUser.save();
  toUser.friendRequestsFrom.push(_fromId);
  await toUser.save();

  res.status(201).end();
});

router.delete('/', async (req, res) => {
  const { fromId, toId, accept } = req.body;

  const fromUser = await User.findById(fromId);
  const toUser = await User.findById(toId);
  if (!fromUser || !toUser) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const _fromId = fromUser._id;
  const _toId = toUser._id;

  if (!fromUser.friendRequestsTo.includes(_toId)) {
    return res.status(400).json({
      error: `friend request does not exist between users`,
    });
  }

  fromUser.friendRequestsTo = fromUser.friendRequestsTo.filter(
    (_id) => !_toId.equals(_id)
  );
  toUser.friendRequestsFrom = toUser.friendRequestsFrom.filter(
    (_id) => !_fromId.equals(_id)
  );

  if (accept === true) {
    fromUser.friends.push(_toId);
    toUser.friends.push(_fromId);
  }

  await fromUser.save();
  await toUser.save();

  res.status(204).end();
});

export default router;
