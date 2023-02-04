import express from 'express';
import User from '../models/userModel';
import { Types } from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
  const { fromId, toId } = req.body;

  const fromUser = await User.findById(fromId);
  if (!fromUser) {
    return res.status(400).json({ error: `invalid sender id ${fromId}` });
  }
  const toUser = await User.findById(toId);
  if (!toUser) {
    return res.status(400).json({ error: `invalid recipient id ${toUser}` });
  }

  const _fromId = new Types.ObjectId(fromId);
  const _toId = new Types.ObjectId(toId);

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

  const _fromId = new Types.ObjectId(fromId);
  const _toId = new Types.ObjectId(toId);

  if (!fromUser.friendRequestsTo.includes(_toId)) {
    const fromName = `${fromUser.name.firstName} ${fromUser.name.lastName}`;
    const toName = `${toUser.name.firstName} ${toUser.name.lastName}`;
    return res.status(400).json({
      error: `friend request from ${fromName} to ${toName} does not exist`,
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
