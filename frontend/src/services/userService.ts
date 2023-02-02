import axios from 'axios';
import { UserToRegister } from '../types';

const baseUrl = '/api/users';

const getUserIndex = async () => {
  const response = await axios.get(`${baseUrl}/index`);
  return response.data;
};

const createUser = async (user: UserToRegister) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export default { getUserIndex, createUser };
