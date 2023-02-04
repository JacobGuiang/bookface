import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User } from '../types';
import userService from '../services/user';
import AcceptRequestButton from './AcceptRequestButton';
import RejectRequestButton from './RejectRequestButton';
import { logError } from '../utils/helpers';

const FriendRequests = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  const query = useQuery(['friends', currentUser.id], () =>
    userService.getUserFriendsById(currentUser.id)
  );

  if (query.isLoading) {
    console.log('getting friends');
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const { friendRequestsFrom } = query.data;

  return (
    <div>
      {friendRequestsFrom
        .map((user: User) => (
          <div key={user.id}>
            {user.name.firstName} {user.name.lastName}
            <AcceptRequestButton fromId={user.id} label="Confirm" />
            <RejectRequestButton fromId={user.id} label="Delete" />
          </div>
        ))
        .reverse()}
    </div>
  );
};

export default FriendRequests;
