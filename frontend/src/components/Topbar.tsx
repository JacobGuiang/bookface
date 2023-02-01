import { useMutation } from 'react-query';
import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import authService from '../services/authService';
import { logError } from '../utils/helpers';

const Topbar = () => {
  const currentUserContext = useContext(CurrentUserContext);
  const user = currentUserContext.currentUser;

  const mutation = useMutation(authService.logout, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('logging out');
      currentUserContext.setCurrentUser(null);
    },
  });

  return (
    <div>
      <div>{user?.username}</div>
      <button onClick={() => mutation.mutate()}>logout</button>
    </div>
  );
};

export default Topbar;
