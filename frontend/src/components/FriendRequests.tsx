import { useContext } from 'react';
import { useQuery } from 'react-query';
import { CurrentUserContext } from '../App';
import userService from '../services/userService';
import { logError } from '../utils/helpers';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { log } from 'console';

const FriendRequests = () => {
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = currentUser?.id as string;

  const query = useQuery(['friendRequests', currentUserId], () =>
    userService.getUserFriendRequestsById(currentUserId)
  );

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
        <Link to={`/users/${user.id}`} key={user.id}>
          {user.name.firstName} {user.name.lastName}
        </Link>
      ))}
    </div>
  );
};

export default FriendRequests;
