import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { User } from '../types';

const CurrentUserPage = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  return (
    <div>
      <div>
        {currentUser.name.firstName} {currentUser.name.lastName}
      </div>
      <div>TODO</div>
    </div>
  );
};

export default CurrentUserPage;
