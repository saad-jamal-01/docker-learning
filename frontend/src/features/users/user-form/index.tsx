import { useState } from 'react';

import { createUser } from '../../../apis/UserApis';

const UserForm = ({ onAddUser }: { onAddUser: () => void }) => {
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [firstNameError, setFirstNameError] = useState<string | null>();
  const [createUserMessage, setCreateUserMessage] = useState<string | null>();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (firstName.trim().length === 0) {
      setFirstNameError('First name required');
      return;
    } else {
      setFirstNameError(null);
    }

    setLoading(true);

    try {
      await createUser(firstName.trim(), lastName.trim());

      setFirstName('');
      setLastName('');
      onAddUser();
      setCreateUserMessage('User created successfully');
    } catch (err) {
      setCreateUserMessage('User can not be created');
    } finally {
      setLoading(false);
    }
  };

  const onNameChange = (nameType: 'f' | 'l', nameValue: string) => {
    if (nameType === 'f') {
      setFirstName(nameValue);
      setFirstNameError(null);
    } else if (nameType === 'l') {
      setLastName(nameValue);
    }
  };

  return (
    <div className="min-w-75">
      <div id="message-section" className="h-10 w-full mb-2">
        {createUserMessage && <div>{createUserMessage}</div>}
      </div>
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
            className={`w-full px-4 py-2 ${firstNameError ? 'border-red-600' : 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'} border rounded-2xl bg-white focus:outline-none text-sm`}
          />
          {firstNameError && (
            <span className="text-red-600">{firstNameError}</span>
          )}
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
            className="w-full px-4 py-2 border rounded-2xl bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-sm"
          />
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={firstName.trim().length === 0 || loading}
            className="px-6 py-1 border rounded-xl bg-white text-sm hover:bg-gray-50 active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer disabled:cursor-no-drop disabled:bg-gray-500 disabled:text-white"
          >
            {loading ? 'Creating' : 'Create'}
          </button>
        </div>
      </form>
      <div className="h-10 w-full mb-2"></div>
    </div>
  );
};

export default UserForm;
