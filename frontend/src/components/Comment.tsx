import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User } from '../types';
import { Link } from 'react-router-dom';
import commentService from '../services/comment';
import DeleteCommentButton from './DeleteCommentButton';
import { logError } from '../utils/helpers';

interface Props {
  commentId: string;
  showDelete?: boolean;
}

const Comment = (props: Props) => {
  const currentUser = useContext(CurrentUserContext) as User;

  const { commentId, showDelete } = props;

  const query = useQuery(['comment', commentId], () =>
    commentService.getCommentById(commentId)
  );

  if (query.isLoading) {
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const { id, author, content, date } = query.data;

  const style = { border: '1px solid red' }; // TEMP

  return (
    <div style={style}>
      <Link to={`users/${author.id}`}>
        {author.name.firstName} {author.name.lastName}
      </Link>
      <div>{content}</div>
      <div>{date}</div>
      {(showDelete === true || author.id === currentUser.id) && (
        <DeleteCommentButton commentId={id} />
      )}
    </div>
  );
};

export default Comment;
