import { Link } from 'react-router-dom';

const FriendNavbar = () => {
  return (
    <ul>
      <li>
        <Link to="/friends">All Friends</Link>
      </li>
      <li>
        <Link to="/friends/requests">Friend Requests</Link>
      </li>
    </ul>
  );
};

export default FriendNavbar;
