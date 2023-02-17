import { useState, useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import commentService from '../services/comment';
import { logError } from '../utils/helpers';

const CommentForm = ({ postId }: { postId: string }) => {
  const currentUser = useContext(CurrentUserContext) as User;
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const mutation = useMutation(commentService.createComment, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('created comment');
      setText('');
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    mutation.mutate({
      postId: postId,
      content: text,
      userId: currentUser.id,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          placeholder="Write a comment..."
          value={text}
          onChange={({ target }) => setText(target.value)}
        />
      </div>
    </form>
  );
};

export default CommentForm;
