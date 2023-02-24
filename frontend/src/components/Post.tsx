import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User } from '../types';
import { Link } from 'react-router-dom';
import postService from '../services/post';
import LikePostButton from './LikePostButton';
import UnlikePostButton from './UnlikePostButton';
import Comment from './Comment';
import CommentForm from './CommentForm';
import DeletePostButton from './DeletePostButton';
import { logError } from '../utils/helpers';

const Post = ({ postId }: { postId: string }) => {
  const currentUser = useContext(CurrentUserContext) as User;

  const query = useQuery(['post', postId], () =>
    postService.getPostById(postId)
  );

  if (query.isLoading) {
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const post = query.data;

  const style = { border: '1px solid black' }; // TEMP

  return (
    <div style={style}>
      <Link to={`users/${post.author.id}`}>
        {post.author.name.firstName} {post.author.name.lastName}
      </Link>
      <div>{post.date}</div>
      {currentUser.id === post.author.id && (
        <DeletePostButton postId={post.id} />
      )}
      <div>{post.content.text}</div>
      <div>
        {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
      </div>
      <div>
        {post.comments.length}{' '}
        {post.comments.length === 1 ? 'comment' : 'comments'}
      </div>
      {!post.likes.includes(currentUser.id) ? (
        <LikePostButton postId={postId} />
      ) : (
        <UnlikePostButton postId={postId} />
      )}
      {post.comments
        .map((id: string) => (
          <Comment
            commentId={id}
            showDelete={post.author.id === currentUser.id}
            key={id}
          />
        ))
        .reverse()}
      <CommentForm postId={postId} />
    </div>
  );
};

export default Post;
