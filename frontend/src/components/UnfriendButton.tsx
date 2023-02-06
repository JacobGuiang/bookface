import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import userService from '../services/user';
import { logError } from '../utils/helpers';

const UnfriendButton = ({ userId }: { userId: string }) => {
  const currentUser = useContext(CurrentUserContext) as User;

  const queryClient = useQueryClient();

  const mutation = useMutation(userService.unfriendUsers, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('removed friend');
      queryClient.invalidateQueries(['friends', currentUser.id]);
      queryClient.invalidateQueries(['friends', userId]);
    },
  });

  return (
    <button
      onClick={() =>
        mutation.mutate({ userIdA: currentUser.id, userIdB: userId })
      }
    >
      Unfriend
    </button>
  );
};

export default UnfriendButton;
