import axios from 'axios';

export const fetchUsersList = async () => {
  const url = `${import.meta.env.VITE_API_URL}/user`;

  await axios({
    url,
    method: 'GET',
  });
};
