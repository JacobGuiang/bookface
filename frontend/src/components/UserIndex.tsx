import { UserIndexDetails } from '../types';
import { Link } from 'react-router-dom';
import UserIndexButton from './UserIndexButton';

const UserIndex = ({ user }: { user: UserIndexDetails }) => {
  return (
    <div>
      <Link to={`/users/${user.id}`}>
        {user.name.firstName} {user.name.lastName}
      </Link>
      <UserIndexButton user={user} />
    </div>
  );
};

export default UserIndex;
