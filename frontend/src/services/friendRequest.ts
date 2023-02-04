import axios from 'axios';

const baseUrl = '/api/friendRequests';

interface Users {
  fromId: string;
  toId: string;
}

const sendRequest = async (users: Users) => {
  const response = await axios.post(baseUrl, users);
  return response.data;
};

const acceptRequest = async (users: Users) => {
  const response = await axios.delete(baseUrl, {
    data: { ...users, accept: true },
  });
  return response.data;
};

const rejectRequest = async (users: Users) => {
  const response = await axios.delete(baseUrl, {
    data: { ...users },
  });
  return response.data;
};

export default {
  sendRequest,
  acceptRequest,
  rejectRequest,
};
