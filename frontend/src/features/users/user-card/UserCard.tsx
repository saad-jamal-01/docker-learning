import { useState } from 'react';
import { deleteUser } from '../../../apis/UserApis';

import type { UserType } from '../types';

const UserCard = ({
  user,
  index,
  onDeleteUser,
}: {
  user: UserType;
  index: number;
  onDeleteUser: () => void;
}) => {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id);
      onDeleteUser();
      showToast('User deleted', 'success');
    } catch (err) {
      showToast('Error deleting user', 'error');
    }
  };

  const renderTopRow = () => {
    return (
      <div className="flex items-center justify-between mb-2">
        <p className="text font-bold leading-tight">
          User: <span className="font-normal">{index + 1}</span>
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="cursor-pointer"
          onClick={handleDeleteUser}
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
    );
  };

  const renderToast = () => {
    if (!toast.show) {
      return;
    }

    return (
      <div
        className={`fixed bottom-5 right-5 flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white transition-all
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
      >
        <span>{toast.type === 'success' ? '✅' : '❌'}</span>
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => setToast({ ...toast, show: false })}
          className="ml-3 font-bold opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] space-y-1">
      {renderTopRow()}
      <p className="text font-bold leading-tight">
        First Name: <span className="font-normal">{user.firstName}</span>
      </p>
      <p className="text font-bold leading-tight">
        Last Name:{' '}
        <span className="font-normal">
          {user.lastName} jkhugrfhvjhnucbgceyugxfunhej
        </span>
      </p>
      <p className="text font-bold leading-tight">
        Added on: <span className="font-normal">{user.addedOn}</span>
      </p>
      {renderToast()}
    </div>
  );
};

export default UserCard;
