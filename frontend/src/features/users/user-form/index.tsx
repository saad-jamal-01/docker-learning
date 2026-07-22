const UserForm = ({
  firstName,
  lastName,
  onNameChange,
  handleAddUser,
}: {
  firstName: string;
  lastName: string;
  handleAddUser: (e: React.FormEvent) => void;
  onNameChange: (nameType: 'f' | 'l', nameValue: string) => void;
}) => {
  return (
    <form onSubmit={handleAddUser} className="space-y-4">
      <div className="flex flex-col space-y-1">
        <label htmlFor="firstName" className="text-sm">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => onNameChange('f', e.target.value)}
          className="w-full px-4 py-2 border rounded-2xl bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-2xl"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="lastName" className="text-sm">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => onNameChange('l', e.target.value)}
          className="w-full px-4 py-2 border rounded-2xl bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-2xl"
        />
      </div>
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="px-6 py-1 border rounded-xl bg-white text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default UserForm;
