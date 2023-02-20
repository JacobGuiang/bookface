import { useQuery, useMutation, useQueryClient } from 'react-query';
import commentService from '../services/comment';
import { logError } from '../utils/helpers';

const DeleteCommentButton = ({ commentId }: { commentId: string }) => {
  const queryClient = useQueryClient();

  const query = useQuery(['comment', commentId], () =>
    commentService.getCommentById(commentId)
  );

  const mutation = useMutation(commentService.deleteCommentById, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('deleted comment');
      queryClient.invalidateQueries(['post', query.data.post]);
    },
  });

  if (query.isLoading) {
    return null;
  }
  if (query.isError) {
    logError(query.error);
  }

  return <button onClick={() => mutation.mutate(commentId)}>Delete</button>;
};

export default DeleteCommentButton;
