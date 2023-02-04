import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { User } from '../types';
import authService from '../services/auth';
import { logError } from '../utils/helpers';

const Header = () => {
  const currentUser = useContext(CurrentUserContext) as User;
  const queryClient = useQueryClient();

  const mutation = useMutation(authService.logout, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('logging out');
      queryClient.invalidateQueries('currentUser');
    },
  });

  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/friends">Friends</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
      <div>
        {currentUser.name.firstName} {currentUser.name.lastName}
      </div>
      <Link to="/">
        <button onClick={() => mutation.mutate()}>logout</button>
      </Link>
    </div>
  );
};

export default Header;
