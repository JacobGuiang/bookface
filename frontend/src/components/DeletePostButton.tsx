import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import postService from '../services/post';
import { logError } from '../utils/helpers';

const DeletePostButton = ({ postId }: { postId: string }) => {
  const currentUser = useContext(CurrentUserContext) as User;

  const queryClient = useQueryClient();

  const mutation = useMutation(postService.deletePostById, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('deleted post');
      queryClient.invalidateQueries(['feed', currentUser.id]);
    },
  });

  return <button onClick={() => mutation.mutate(postId)}>Delete post</button>;
};

export default DeletePostButton;
