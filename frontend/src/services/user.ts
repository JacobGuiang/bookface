import axios from 'axios';
import { Name } from '../types';

const baseUrl = '/api/users';

interface UserToRegister {
  username: string;
  password: string;
  name: Name;
}

interface UnfriendUsers {
  userIdA: string;
  userIdB: string;
}

const getAllUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const getUserFriendsById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}/friends`);
  return response.data;
};

const getUserFeedById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}/feed`);
  return response.data;
};

const createUser = async (user: UserToRegister) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

const unfriendUsers = async (users: UnfriendUsers) => {
  const { userIdA, userIdB } = users;
  const response = await axios.delete(
    `${baseUrl}/${userIdA}/friends/${userIdB}`
  );
  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  getUserFriendsById,
  getUserFeedById,
  createUser,
  unfriendUsers,
};
