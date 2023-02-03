import { User } from '../types';
import { Link } from 'react-router-dom';
import UserIndexButton from './UserIndexButton';

const UserIndex = ({ user }: { user: User }) => {
  return (
    <div>
      <Link to={`/users/${user.id}`}>
        {user.name.firstName} {user.name.lastName}
      </Link>
      <UserIndexButton userId={user.id} />
    </div>
  );
};

export default UserIndex;
