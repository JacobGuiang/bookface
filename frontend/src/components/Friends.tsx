import { useContext } from 'react';
import { useQuery } from 'react-query';
import { CurrentUserContext } from '../App';
import userService from '../services/userService';
import { logError } from '../utils/helpers';
import { User } from '../types';
import { Link } from 'react-router-dom';

const Friends = () => {
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = currentUser?.id as string;

  const query = useQuery(['friends', currentUserId], () =>
    userService.getUserFriendsById(currentUserId)
  );

  if (query.isLoading) {
    console.log('getting friends');
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const { friends } = query.data;

  const sortedFriends = friends.sort((a: User, b: User) =>
    a.name.firstName.localeCompare(b.name.firstName)
  );

  return (
    <div>
      {sortedFriends.map((user: User) => (
        <div key={user.id}>
          <Link to={`/users/${user.id}`}>
            {user.name.firstName} {user.name.lastName}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Friends;
