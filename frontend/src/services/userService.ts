import axios from 'axios';
import { NewUser } from '../types';

const baseUrl = '/api/users';

const getLoggedInUser = async () => {
  const response = await axios.get(`${baseUrl}/loggedInUser`, {
    withCredentials: true,
  });
  return response.data;
};

const createUser = async (user: NewUser) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export default { getLoggedInUser, createUser };
