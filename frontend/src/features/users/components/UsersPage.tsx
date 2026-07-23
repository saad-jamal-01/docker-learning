import { useState, useEffect } from 'react';

import UserForm from '../user-form';
import UserCard from '../user-card/UserCard';

import { fetchUsersList } from '../../../apis/UserApis';

import type { UserType } from '../types';

const UsersPage = () => {
  const [loading, setLoading] = useState(false);
  const [toggleToRenderPage, setToggleToRenderPage] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);

  const onFetchUsersList = async () => {
    setLoading(true);

    try {
      const usersList = await fetchUsersList();
      setUsers(usersList);
    } catch (err) {
      console.log('error fetching users: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchUsersList();
  }, [toggleToRenderPage]);

  useEffect(() => {
    onFetchUsersList();
  }, []);

  return (
    <div className="h-screen w-full text-gray-900 flex items-center justify-center select-none overflow-hidden">
      <div className="h-full max-h-[90vh] px-16 sm:px-6 flex flex-col sm:flex-row gap-6 items-center">
        <UserForm
          onAddUser={() => setToggleToRenderPage((prevState) => !prevState)}
        />
        <div className="h-full max-h-full overflow-y-auto pr-2">
          {loading ? (
            <div>Fetching users ...</div>
          ) : (
            <div className="space-y-4 pt-2">
              {users.map((user) => (
                <UserCard key={`user-card-${user.id}`} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
