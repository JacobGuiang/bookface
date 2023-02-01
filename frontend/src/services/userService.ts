import axios from 'axios';
import { UserToRegister } from '../types';

const baseUrl = '/api/users';

const createUser = async (user: UserToRegister) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export default { createUser };
