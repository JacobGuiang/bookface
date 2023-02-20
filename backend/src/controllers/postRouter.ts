import express from 'express';
import Post from '../models/postModel';
import Comment from '../models/commentModel';
import User from '../models/userModel';

const router = express.Router();

router.post('/', async (req, res) => {
  const userId = req.body.author;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ error: `invalid user id: ${userId}` });
  }

  const post = new Post({ ...req.body });
  const savedPost = await post.save();

  user.posts.push(savedPost._id);
  await user.save();

  const postToReturn = await savedPost.populate('author', 'name');
  res.status(201).json(postToReturn);
});

router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId).populate('author', 'name');

  if (!post) {
    return res.status(400).json({ error: `invalid post id: ${postId}` });
  }

  res.json(post);
});

router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    return res.status(400).json({ error: `invalid post id: ${postId}` });
  }

  const user = await User.findById(deletedPost.author);

  if (!user) {
    return res
      .status(400)
      .json({ error: `invalid user id: ${deletedPost.author}` });
  }

  user.posts = user.posts.filter((_id) => !_id.equals(postId));
  await user?.save();

  deletedPost.comments.forEach(
    async (_id) => await Comment.findByIdAndDelete(_id)
  );

  res.status(204).end();
});

router.post('/:id/likes', async (req, res) => {
  const postId = req.params.id;
  const { userId, action } = req.body;

  const post = await Post.findById(postId);
  const user = await User.findById(userId);

  if (!post || !user) {
    return res.status(400).json({ error: 'invalid ids' });
  }
  if (action !== 'like' && action !== 'unlike') {
    return res.status(400).json({ error: 'invalid action' });
  }

  if (action === 'like') {
    if (post.likes.includes(user._id)) {
      return res.status(400).json({ error: 'user already liked this post' });
    }
    post.likes.push(user._id);
  } else if (action === 'unlike') {
    if (!post.likes.includes(user._id)) {
      return res.status(400).json({ error: 'user has not liked this post ' });
    }
    post.likes = post.likes.filter((_id) => !_id.equals(user._id));
  }

  const updatedPost = await post.save();
  res.json(updatedPost);
});

export default router;
