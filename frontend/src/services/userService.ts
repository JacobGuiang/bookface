import axios from 'axios';
import { UserToRegister } from '../types';

const baseUrl = '/api/users';

const getUserById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const getUserIndex = async () => {
  const response = await axios.get(`${baseUrl}/index`);
  return response.data;
};

const createUser = async (user: UserToRegister) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export default { getUserById, getUserIndex, createUser };
