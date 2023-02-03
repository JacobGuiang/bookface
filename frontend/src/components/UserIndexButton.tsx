import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CurrentUserContext } from '../App';
import friendRequestService from '../services/friendRequestService';
import { logError } from '../utils/helpers';
import userService from '../services/userService';
import { User } from '../types';

const UserIndexButton = ({ userId }: { userId: string }) => {
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = currentUser?.id as string;

  const query = useQuery(['friends', currentUserId], () =>
    userService.getUserFriendsById(currentUserId)
  );

  const queryClient = useQueryClient();

  const sendMutation = useMutation(friendRequestService.sendRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('sent request');
      queryClient.invalidateQueries(['friends', currentUserId]);
      queryClient.invalidateQueries(['friends', userId]);
    },
  });
  const acceptMutation = useMutation(friendRequestService.acceptRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('accepted request');
      queryClient.invalidateQueries(['friends', currentUserId]);
      queryClient.invalidateQueries(['friends', userId]);
    },
  });
  const rejectMutation = useMutation(friendRequestService.rejectRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('rejected request');
      queryClient.invalidateQueries(['friends', currentUserId]);
      queryClient.invalidateQueries(['friends', userId]);
    },
  });

  if (query.isLoading) {
    console.log('getting friends');
    return null;
  }
  if (query.isError) {
    logError(query.data);
    return null;
  }

  const { data } = query;

  let buttonLabel;
  let handleClick: () => void;
  if (data.friendRequestsFrom.find((u: User) => u.id === userId)) {
    buttonLabel = 'Confirm request';
    handleClick = () =>
      acceptMutation.mutate({
        fromId: userId,
        toId: currentUserId,
      });
  } else if (data.friendRequestsTo.find((u: User) => u.id === userId)) {
    buttonLabel = 'Cancel request';
    handleClick = () =>
      rejectMutation.mutate({
        fromId: currentUserId,
        toId: userId,
      });
  } else if (!data.friends.find((u: User) => u.id === userId)) {
    buttonLabel = 'Add friend';
    handleClick = () =>
      sendMutation.mutate({
        fromId: currentUserId,
        toId: userId,
      });
  }

  if (buttonLabel) {
    return <button onClick={() => handleClick?.()}>{buttonLabel}</button>;
  }
  return null;
};

export default UserIndexButton;
