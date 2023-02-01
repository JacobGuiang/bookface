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

  if (fromUser.friends.includes(toId)) {
    return res.status(400).json({ error: `users are already friends` });
  }

  let friendRequest = await FriendRequest.findOne({ fromId, toId });

  friendRequest =
    friendRequest ||
    (await FriendRequest.findOne({ fromId: toId, toId: fromId }));

  if (friendRequest) {
    return res.status(400).json({
      error: `friend request already exists between users`,
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

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const { accept } = req.body;

  const friendRequest = await FriendRequest.findById(id);
  if (!friendRequest) {
    return res.json({ error: `invalid id ${id}` });
  }

  const { fromId, toId } = friendRequest;

  const fromUser = await User.findById(fromId);
  const toUser = await User.findById(toId);
  if (!fromUser || !toUser) {
    return res.json({ error: `invalid ids stored in friend request` });
  }

  fromUser.friendRequestsTo = fromUser.friendRequestsTo.filter(
    (_id) => !toId.equals(_id)
  );
  toUser.friendRequestsFrom = toUser.friendRequestsFrom.filter(
    (_id) => !fromId.equals(_id)
  );

  if (accept === true) {
    fromUser.friends.push(toId);
    toUser.friends.push(fromId);
  }

  await fromUser.save();
  await toUser.save();
  await FriendRequest.findByIdAndDelete(id);

  res.status(204).end();
});

export default router;
