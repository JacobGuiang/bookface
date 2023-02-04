import { User, FriendData } from '../types';
import { Link } from 'react-router-dom';
import AcceptRequestButton from './AcceptRequestButton';
import CancelRequestButton from './CancelRequestButton';
import SendRequestButton from './SendRequestButton';

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

export default UserIndexItem;
