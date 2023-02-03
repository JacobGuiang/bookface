import { useQuery } from 'react-query';
import userService from '../services/userService';
import { logError } from '../utils/helpers';
import { UserIndexDetails } from '../types';
import UserIndex from './UserIndex';
import { CurrentUserContext } from '../App';
import { useContext } from 'react';

const Users = () => {
  const query = useQuery('users', userService.getUserIndex);
  const currentUser = useContext(CurrentUserContext);

  if (query.isLoading) {
    console.log('getting users');
  }
  if (query.isError) {
    logError(query.error);
  }

  const users = query.data;

  return (
    <div>
      <div>People</div>
      <ul>
        {users
          ?.map((user: UserIndexDetails) => {
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
