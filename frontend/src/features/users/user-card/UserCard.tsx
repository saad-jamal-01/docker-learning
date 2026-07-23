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
  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id);
      onDeleteUser();
    } catch (err) {}
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] space-y-1">
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
    </div>
  );
};

export default UserCard;
