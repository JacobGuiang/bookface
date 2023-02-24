import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User, FriendData } from '../types';
import { Link } from 'react-router-dom';
import userService from '../services/user';
import AcceptRequestButton from './AcceptRequestButton';
import CancelRequestButton from './CancelRequestButton';
import SendRequestButton from './SendRequestButton';
import { logError } from '../utils/helpers';

interface Props {
  user: User;
  friendData: FriendData;
}

const UserIndexItem = (props: Props) => {
  const { user, friendData } = props;
  const { friendRequestsFrom, friendRequestsTo, friends } = friendData;

  let button = null;

  if (friendRequestsFrom.find((u: User) => u.id === user.id)) {
    button = <AcceptRequestButton fromId={user.id} label="Confirm request" />;
  } else if (friendRequestsTo.find((u: User) => u.id === user.id)) {
    button = <CancelRequestButton toId={user.id} label="Cancel request" />;
  } else if (!friends.find((u: User) => u.id === user.id)) {
    button = <SendRequestButton toId={user.id} label="Add friend" />;
  }

  return (
    <div>
      <Link to={`/users/${user.id}`}>
        {user.name.firstName} {user.name.lastName}
      </Link>
      {button}
    </div>
  );
};

const UserIndex = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  const usersQuery = useQuery('users', userService.getAllUsers);
  const friendsQuery = useQuery(['friends', currentUser.id], () =>
    userService.getUserFriendsById(currentUser.id)
  );

  if (usersQuery.isLoading || friendsQuery.isLoading) {
    console.log('getting users or friends');
    return null;
  }
  if (usersQuery.isError) {
    logError(usersQuery.error);
    return null;
  }
  if (friendsQuery.isError) {
    logError(friendsQuery.error);
    return null;
  }

  const users = usersQuery.data;

  return (
    <div>
      <div>People</div>
      <ul>
        {users
          .map((user: User) => {
            if (user.id !== currentUser.id) {
              return (
                <li key={user.id}>
                  <UserIndexItem user={user} friendData={friendsQuery.data} />
                </li>
              );
            }
          })
          .reverse()}
      </ul>
    </div>
  );
};

export default UserIndex;
