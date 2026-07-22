import type { UserType } from '../types';

const UserCard = ({ user }: { user: UserType }) => {
  return (
    <div
      key={user.id}
      className="p-4 border-2 border-black rounded-3xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1"
    >
      <p className="text-2xl font-bold leading-tight">
        First Name: <span className="font-normal">{user.firstName}</span>
      </p>
      <p className="text-2xl font-bold leading-tight">
        Last Name: <span className="font-normal">{user.lastName}</span>
      </p>
      <p className="text-2xl font-bold leading-tight">
        Added on: <span className="font-normal">{user.addedOn}</span>
      </p>
    </div>
  );
};

export default UserCard;
