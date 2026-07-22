import React, { useState, useEffect } from 'react';

import UserForm from '../user-form';
import UserCard from '../user-card/UserCard';

import { fetchUsersList } from '../../../apis/UserApis';

import type { UserType } from '../types';

const UsersPage = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) return;

    setFirstName('');
    setLastName('');
  };

  const onNameChange = (nameType: 'f' | 'l', nameValue: string) => {
    if (nameType === 'f') {
      setFirstName(nameValue);
    } else if (nameType === 'l') {
      setLastName(nameValue);
    }
  };

  const onFetchUsersList = async () => {
    setLoading(true);
    try {
      await fetchUsersList();
    } catch (err) {
      console.log('error fetching users: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchUsersList();
  }, []);

  return (
    <div className="min-h-screen bg-amber-300 text-gray-900 p-6 flex items-center justify-center select-none">
      <div className="w-full bg-amber-700 max-w-sm flex flex-row">
        <UserForm
          firstName={firstName}
          lastName={lastName}
          onNameChange={onNameChange}
          handleAddUser={handleAddUser}
        />
        {loading ? (
          <div>Fetching users ...</div>
        ) : (
          <div className="space-y-4 pt-2">
            {[].map((user) => (
              <UserCard user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
