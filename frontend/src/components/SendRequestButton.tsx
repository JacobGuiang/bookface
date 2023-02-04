import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import friendRequestService from '../services/friendRequest';
import { logError } from '../utils/helpers';

interface Props {
  toId: string;
  label: string;
}

const SendRequestButton = (props: Props) => {
  const { toId, label } = props;

  const currentUser = useContext(CurrentUserContext) as User;

  const queryClient = useQueryClient();

  const mutation = useMutation(friendRequestService.sendRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('sent request');
      queryClient.invalidateQueries(['friends', currentUser.id]);
    },
  });

  return (
    <button onClick={() => mutation.mutate({ fromId: currentUser.id, toId })}>
      {label}
    </button>
  );
};

export default SendRequestButton;
