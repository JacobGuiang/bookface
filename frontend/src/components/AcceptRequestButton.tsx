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

const AcceptRequestButton = (props: Props) => {
  const { fromId, label } = props;

  const currentUser = useContext(CurrentUserContext) as User;

  const queryClient = useQueryClient();

  const mutation = useMutation(friendRequestService.acceptRequest, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('accepted request');
      queryClient.invalidateQueries(['friends', currentUser.id]);
      // queryClient.invalidateQueries(['friends', fromId]);
    },
  });

  return (
    <button
      onClick={() =>
        mutation.mutate({
          fromId,
          toId: currentUser.id,
        })
      }
    >
      {label}
    </button>
  );
};

export default AcceptRequestButton;
