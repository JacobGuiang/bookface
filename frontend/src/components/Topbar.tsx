import { useMutation, useQueryClient } from 'react-query';
import { useContext } from 'react';
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
      <div>{currentUser?.username}</div>
      <button onClick={() => mutation.mutate()}>logout</button>
    </div>
  );
};

export default Topbar;
