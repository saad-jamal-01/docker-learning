import axios from 'axios';

import type { UserType } from '../features/users/types';

export const fetchUsersList = async () => {
  const url = `${import.meta.env.VITE_API_URL}/user`;

  const { status, data } = await axios({
    url,
    method: 'GET',
  });

  if (status > 299) {
    throw new Error('Error fetching users list');
  }

  const userResponseList = data.users ?? [];
  const usersList: UserType[] = userResponseList.map((user: any) => {
    return {
      id: `${user.id}`,
      firstName: user.firstName,
      lastName: user.lastName,
      addedOn: user.createdAt,
    };
  });

  return usersList;
};

export const createUser = async (firstName: string, lastName: string) => {
  const url = `${import.meta.env.VITE_API_URL}/user`;

  const { status } = await axios({
    url,
    method: 'POST',
    data: {
      firstName,
      lastName,
    },
  });

  if (status > 299) {
    throw new Error();
  }
};
