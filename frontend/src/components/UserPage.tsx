import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User, FriendData } from '../types';
import { useParams } from 'react-router-dom';
import userService from '../services/user';
import CurrentUserPage from './CurrentUserPage';
import AcceptRequestButton from './AcceptRequestButton';
import RejectRequestButton from './RejectRequestButton';
import CancelRequestButton from './CancelRequestButton';
import SendRequestButton from './SendRequestButton';
import UnfriendButton from './UnfriendButton';
import Post from './Post';
import { logError } from '../utils/helpers';

interface FriendStatusProps {
  userId: string;
  userFirstName: string;
  friendData: FriendData;
}

const FriendStatus = (props: FriendStatusProps) => {
  const { userId, userFirstName, friendData } = props;
  const { friendRequestsFrom, friendRequestsTo, friends } = friendData;

  if (friendRequestsFrom.find((u: User) => u.id === userId)) {
    return (
      <div>
        {userFirstName} sent you a friend request
        <AcceptRequestButton fromId={userId} label="Confirm request" />
        <RejectRequestButton fromId={userId} label="Delete request" />
      </div>
    );
  } else if (friendRequestsTo.find((u: User) => u.id === userId)) {
    return <CancelRequestButton toId={userId} label="Cancel Request" />;
  } else if (!friends.find((u: User) => u.id === userId)) {
    return <SendRequestButton toId={userId} label="Add Friend" />;
  } else {
    return <UnfriendButton userId={userId} />;
  }
};

const FriendItem = ({ userId }: { userId: string }) => {
  const query = useQuery(['cover', userId], () =>
    userService.getUserCoverById(userId)
  );

  if (query.isLoading) {
    return null;
  }
  if (query.isError) {
    logError(query.error);
  }

  const user = query.data;

  return (
    <div>
      <div>
        {user.name.firstName} {user.name.lastName}
      </div>
    </div>
  );
};

const UserPage = () => {
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = currentUser?.id as string;
  const userId = useParams().id as string;

  const userQuery = useQuery(['user', userId], () =>
    userService.getUserById(userId)
  );
  const friendsQuery = useQuery(['friends', currentUserId], () =>
    userService.getUserFriendsById(currentUserId)
  );

  if (currentUserId === userId) {
    return <CurrentUserPage />;
  }

  if (userQuery.isLoading || friendsQuery.isLoading) {
    console.log('getting user or friends');
    return null;
  }
  if (userQuery.isError) {
    logError(userQuery.error);
    return null;
  }
  if (friendsQuery.isError) {
    logError(friendsQuery.error);
    return null;
  }

  const user = userQuery.data;

  const style = { border: '1px solid black' }; // TEMP

  return (
    <div>
      <div>
        {user.name.firstName} {user.name.lastName}
      </div>
      <FriendStatus
        userId={userId}
        userFirstName={user.name.firstName}
        friendData={friendsQuery.data as FriendData}
      />
      <div style={style}>
        <div>Friends</div>
        <div>
          {user.friends.length}{' '}
          {user.friends.length === 1 ? 'friend' : 'friends'}
        </div>
        {user.friends.map((userId: string) => (
          <FriendItem userId={userId} key={userId} />
        ))}
      </div>
      <div>Posts</div>
      {user.posts.map((postId: string) => (
        <Post postId={postId} key={postId} />
      ))}
    </div>
  );
};

export default UserPage;
