import { useMutation, useQueryClient } from 'react-query';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../App';
import authService from '../services/authService';
import { logError } from '../utils/helpers';

const Topbar = () => {
  const currentUser = useContext(CurrentUserContext);
  const queryClient = useQueryClient();

  const mutation = useMutation(authService.logout, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('logging out');
      queryClient.setQueryData('currentUser', null);
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
        {currentUser?.name.firstName} {currentUser?.name.lastName}
      </div>
      <Link to="/">
        <button onClick={() => mutation.mutate()}>logout</button>
      </Link>
    </div>
  );
};

export default Topbar;
