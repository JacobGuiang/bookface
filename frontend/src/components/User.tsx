import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import userService from '../services/userService';
import { logError } from '../utils/helpers';

const User = () => {
  const id = useParams().id as string;
  const query = useQuery(['user', id], () => userService.getUserById(id));

  if (query.isLoading) {
    console.log('getting user');
    return null;
  } else if (query.isError) {
    logError(query.error);
    return null;
  }

  const user = query.data;

  // TODO

  return (
    <div>
      <div>
        {user.name.firstName} {user.name.lastName}
      </div>
    </div>
  );
};

export default User;
