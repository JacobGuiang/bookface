import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { User } from '../types';
import userService from '../services/user';
import { logError } from '../utils/helpers';

const Friends = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  const query = useQuery(['friends', currentUser.id], () =>
    userService.getUserFriendsById(currentUser.id)
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

  const sortedFriends = friends.sort((a: User, b: User) => {
    const aFullName = `${a.name.firstName} ${a.name.lastName}`;
    const bFullName = `${b.name.firstName} ${b.name.lastName}`;
    if (aFullName < bFullName) {
      return -1;
    }
    if (aFullName > bFullName) {
      return 1;
    }
    return 0;
  });

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
