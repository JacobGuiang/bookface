import axios from 'axios';

const baseUrl = '/api/posts';

interface Post {
  content: {
    text: string;
  };
  author: string;
}

const getPostById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const createPost = async (post: Post) => {
  const response = await axios.post(baseUrl, { ...post });
  return response.data;
};

const deletePostById = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default { getPostById, createPost, deletePostById };
