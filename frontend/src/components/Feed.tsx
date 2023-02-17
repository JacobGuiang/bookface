import { useContext } from 'react';
import { CurrentUserContext } from '../App';
import { useQuery } from 'react-query';
import { User } from '../types';
import userService from '../services/user';
import PostForm from './PostForm';
import Post from './Post';
import { logError } from '../utils/helpers';

const Feed = () => {
  const currentUser = useContext(CurrentUserContext) as User;

  const query = useQuery(['feed', currentUser.id], () =>
    userService.getUserFeedById(currentUser.id)
  );

  if (query.isLoading) {
    console.log('getting feed');
    return null;
  }
  if (query.isError) {
    logError(query.error);
    return null;
  }

  const posts = query.data;

  return (
    <div>
      <PostForm
        placeholder={`What's on your mind, ${currentUser.name.firstName}?`}
      />
      {posts.map(({ id }: { id: string }) => (
        <Post postId={id} key={id} />
      ))}
    </div>
  );
};

export default Feed;
