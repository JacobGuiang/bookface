import { Link } from 'react-router-dom';

const FriendSidebar = () => {
  return (
    <ul>
      <li>
        <Link to="/friends">Friend Requests</Link>
      </li>
      <li>
        <Link to="/friends/list">All Friends</Link>
      </li>
    </ul>
  );
};

export default FriendSidebar;
