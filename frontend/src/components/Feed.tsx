import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { User } from '../types';
import PostForm from './PostForm';

const Feed = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  return (
    <div>
      <PostForm
        placeholder={`What's on your mind, ${currentUser.name.firstName}?`}
      />
    </div>
  );
};

export default Feed;
