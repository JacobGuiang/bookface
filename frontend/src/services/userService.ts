import axios from 'axios';

const baseUrl = '/api/users';

const getLoggedInUser = async () => {
  const response = await axios.get(`${baseUrl}/loggedInUser`, {
    withCredentials: true,
  });
  return response.data;
};

export default { getLoggedInUser };
