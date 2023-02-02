import { useContext } from 'react';
import { UserIndexDetails } from '../types';
import { CurrentUserContext } from '../Home';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';

const UserIndex = ({ user }: { user: UserIndexDetails }) => {
  const currentUser = useContext(CurrentUserContext);

  // TODO

  return (
    <div>
      <div>
        <Link to={`/users/${user.id}`}>
          {user.name.firstName} {user.name.lastName}{' '}
        </Link>
      </div>
    </div>
  );
};

export default UserIndex;
