import axios from 'axios';

interface loginObj {
  username: string;
  password: string;
}

const baseUrl = '/api/auth';

const login = async (obj: loginObj) => {
  const response = await axios.post(`${baseUrl}/login`, obj);
  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${baseUrl}/logout`);
  return response.data;
};

export default { login, logout };
