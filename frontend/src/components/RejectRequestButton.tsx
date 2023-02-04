import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types';
import friendRequestService from '../services/friendRequest';
import { logError } from '../utils/helpers';

interface Props {
  fromId: string;
  label: string;
}

const RejectRequestButton = (props: Props) => {
  const { fromId, label } = props;

  const currentUser = useContext(CurrentUserContext) as User;

  const queryClient = useQueryClient();

  const mutation = useMutation(friendRequestService.rejectRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('rejected request');
      queryClient.invalidateQueries(['friends', currentUser.id]);
    },
  });

  return (
    <button onClick={() => mutation.mutate({ fromId, toId: currentUser.id })}>
      {label}
    </button>
  );
};

export default RejectRequestButton;
