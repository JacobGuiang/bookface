import axios from 'axios';

const baseUrl = '/api/auth';

interface credentials {
  username: string;
  password: string;
}

const login = async (creds: credentials) => {
  const response = await axios.post(`${baseUrl}/login`, creds);
  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${baseUrl}/logout`);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await axios.get(`${baseUrl}/current`, {
    withCredentials: true,
  });
  return response.data;
};

export default { login, logout, getCurrentUser };
