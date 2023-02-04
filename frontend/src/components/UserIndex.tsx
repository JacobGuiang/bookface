import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User } from '../types';
import userService from '../services/user';
import UserIndexItem from './UserIndexItem';
import { logError } from '../utils/helpers';

const UserIndex = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  const usersQuery = useQuery('users', userService.getAllUsers);
  const friendsQuery = useQuery(['friends', currentUser.id], () =>
    userService.getUserFriendsById(currentUser.id)
  );

  if (usersQuery.isLoading || friendsQuery.isLoading) {
    console.log('getting users or friends');
    return null;
  }
  if (usersQuery.isError) {
    logError(usersQuery.error);
    return null;
  }
  if (friendsQuery.isError) {
    logError(friendsQuery.error);
    return null;
  }

  const users = usersQuery.data;

  return (
    <div>
      <div>People</div>
      <ul>
        {users
          .map((user: User) => {
            if (user.id !== currentUser.id) {
              return (
                <li key={user.id}>
                  <UserIndexItem user={user} friendData={friendsQuery.data} />
                </li>
              );
            }
          })
          .reverse()}
      </ul>
    </div>
  );
};

export default UserIndex;
