import { useQuery } from 'react-query';
import userService from '../services/userService';
import { logError } from '../utils/helpers';
import { User } from '../types';
import { CurrentUserContext } from '../App';
import { useContext } from 'react';
import UserIndex from './UserIndex';

const Users = () => {
  const currentUser = useContext(CurrentUserContext);
  const query = useQuery('users', userService.getAllUsers);

  if (query.isLoading) {
    console.log('getting users');
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const users = query.data;

  return (
    <div>
      <div>People</div>
      <ul>
        {users
          .map((user: User) => {
            if (user.id !== currentUser?.id) {
              return (
                <li key={user.id}>
                  <UserIndex user={user} />
                </li>
              );
            }
          })
          .reverse()}
      </ul>
    </div>
  );
};

export default Users;
