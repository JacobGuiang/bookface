import axios from 'axios';
import { UserToRegister } from '../types';

const baseUrl = '/api/users';

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

const createUser = async (user: UserToRegister) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  getUserFriendsById,
  createUser,
};
