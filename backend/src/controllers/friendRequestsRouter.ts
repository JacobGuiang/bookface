import express from 'express';
import User from '../models/userModel';
import FriendRequest from '../models/friendRequestModel';

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

  let friendRequest = await FriendRequest.findOne({ fromId, toId });

  friendRequest =
    friendRequest ||
    (await FriendRequest.findOne({ fromId: toId, toId: fromId }));

  if (friendRequest) {
    const fromFullName = `${fromUser.name.firstName} ${fromUser.name.lastName}`;
    const toFullName = `${toUser.name.firstName} ${toUser.name.lastName}`;
    return res.status(400).json({
      error: `friend request already exists between ${fromFullName} and ${toFullName}`,
    });
  }

  fromUser.friendRequestsTo.push(toId);
  await fromUser.save();
  toUser.friendRequestsFrom.push(fromId);
  await toUser.save();

  friendRequest = new FriendRequest({
    fromId,
    toId,
    fromName: fromUser.name,
    toName: toUser.name,
  });
  const savedFriendRequest = await friendRequest.save();

  res.status(201).json(savedFriendRequest);
});

export default router;
