import { useState, useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import postService from '../services/post';
import { logError } from '../utils/helpers';

const PostForm = ({ placeholder }: { placeholder: string }) => {
  const currentUser = useContext(CurrentUserContext) as User;
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const mutation = useMutation(postService.createPost, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('created post');
      setText('');
      queryClient.invalidateQueries(['feed', currentUser.id]);
    },
  });

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    mutation.mutate({
      content: {
        text: text,
      },
      author: currentUser.id,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          placeholder={placeholder}
          value={text}
          onChange={({ target }) => setText(target.value)}
        />
      </div>
    </form>
  );
};

export default PostForm;
