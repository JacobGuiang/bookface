import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import postService from '../services/post';
import { logError } from '../utils/helpers';

const UnlikePostButton = ({ postId }: { postId: string }) => {
  const currentUser = useContext(CurrentUserContext) as User;

  const queryClient = useQueryClient();

  const mutation = useMutation(postService.updatePostLikes, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  return (
    <button
      onClick={() =>
        mutation.mutate({ postId, userId: currentUser.id, action: 'unlike' })
      }
    >
      Unlike
    </button>
  );
};

export default UnlikePostButton;
