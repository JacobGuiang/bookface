import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { UserIndexDetails } from '../types';
import { CurrentUserContext } from '../App';
import friendRequestService from '../services/friendRequestService';
import { logError } from '../utils/helpers';

const UserIndexButton = ({ user }: { user: UserIndexDetails }) => {
  const currentUser = useContext(CurrentUserContext);
  const queryClient = useQueryClient();

  const sendMutation = useMutation(friendRequestService.sendRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('sent request');
      queryClient.invalidateQueries('users');
    },
  });
  const acceptMutation = useMutation(friendRequestService.acceptRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('accepted request');
      queryClient.invalidateQueries('users');
    },
  });
  const rejectMutation = useMutation(friendRequestService.rejectRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('rejected request');
      queryClient.invalidateQueries('users');
    },
  });

  const currentUserId = currentUser?.id as string;

  let buttonLabel;
  let handleClick: () => void;
  if (user.friendRequestsTo.includes(currentUserId)) {
    buttonLabel = 'Confirm request';
    handleClick = () =>
      acceptMutation.mutate({
        fromId: user.id,
        toId: currentUserId,
      });
  } else if (user.friendRequestsFrom.includes(currentUserId)) {
    buttonLabel = 'Cancel request';
    handleClick = () =>
      rejectMutation.mutate({
        fromId: currentUserId,
        toId: user.id,
      });
  } else if (!user.friends.includes(currentUserId)) {
    buttonLabel = 'Add friend';
    handleClick = () =>
      sendMutation.mutate({
        fromId: currentUserId,
        toId: user.id,
      });
  }

  if (buttonLabel) {
    return <button onClick={() => handleClick?.()}>{buttonLabel}</button>;
  }
  return null;
};

export default UserIndexButton;
