import express from 'express';
import Comment from '../models/commentModel';
import Post from '../models/postModel';

const router = express.Router();

router.post('/', async (req, res) => {
  const { postId, content, userId } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(400).json({ error: `invalid post id: ${postId}` });
  }

  const comment = new Comment({ content, author: userId, post: postId });
  const savedComment = await comment.save();

  post.comments.push(comment._id);
  await post.save();

  res.status(201).json(savedComment);
});

router.delete('/:id', async (req, res) => {
  const commentId = req.params.id;
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    return res.status(400).json({ error: `invalid comment id: ${commentId}` });
  }

  const post = await Post.findById(deletedComment.post);

  if (!post) {
    return res
      .status(400)
      .json({ error: `invalid post id: ${deletedComment.post}` });
  }

  post.comments = post.comments.filter(
    (_id) => !_id.equals(deletedComment._id)
  );
  await post.save();

  res.status(204).end();
});

export default router;
