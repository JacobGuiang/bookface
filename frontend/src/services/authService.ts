import axios from 'axios';

interface credentials {
  username: string;
  password: string;
}

const baseUrl = '/api/auth';

const login = async (creds: credentials) => {
  const response = await axios.post(`${baseUrl}/login`, creds);
  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${baseUrl}/logout`);
  return response.data;
};

export default { login, logout };
