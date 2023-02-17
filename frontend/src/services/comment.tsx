import axios from 'axios';

const baseUrl = '/api/comments';

interface NewComment {
  postId: string;
  content: string;
  userId: string;
}

const getCommentById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const createComment = async (newComment: NewComment) => {
  const response = await axios.post(baseUrl, { ...newComment });
  return response.data;
};

const deleteCommentById = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default { getCommentById, createComment, deleteCommentById };
