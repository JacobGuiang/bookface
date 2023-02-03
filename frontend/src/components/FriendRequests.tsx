import { useContext } from 'react';
import { useQuery } from 'react-query';
import { CurrentUserContext } from '../App';
import userService from '../services/userService';
import { logError } from '../utils/helpers';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import friendRequestService from '../services/friendRequestService';

const FriendRequests = () => {
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = currentUser?.id as string;
  const queryClient = useQueryClient();

  const query = useQuery(['friends', currentUserId], () =>
    userService.getUserFriendsById(currentUserId)
  );

  const acceptMutation = useMutation(friendRequestService.acceptRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('accepted request');
      queryClient.invalidateQueries(['friends', currentUserId]);
    },
  });
  const rejectMutation = useMutation(friendRequestService.rejectRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('rejected request');
      queryClient.invalidateQueries(['friends', currentUserId]);
    },
  });

  if (query.isLoading) {
    console.log('getting friends');
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const { friendRequestsFrom } = query.data;

  return (
    <div>
      {friendRequestsFrom.map((user: User) => (
        <div key={user.id}>
          <Link to={`/users/${user.id}`}>
            {user.name.firstName} {user.name.lastName}
          </Link>
          <button
            onClick={() =>
              acceptMutation.mutate(
                { fromId: user.id, toId: currentUserId },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(['friends', user.id]);
                  },
                }
              )
            }
          >
            Confirm
          </button>
          <button
            onClick={() =>
              rejectMutation.mutate(
                { fromId: user.id, toId: currentUserId },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(['friends', user.id]);
                  },
                }
              )
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
