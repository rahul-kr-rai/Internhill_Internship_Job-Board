import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile(){
  const { user } = useContext(AuthContext);
  if (!user) return <div className="py-8">Please login to see profile.</div>;

  return (
    <div className="py-8">
      <div className="max-w-md bg-white p-6 rounded shadow">
        <h3 className="font-semibold">Profile</h3>
        <div className="mt-3">
          <div className="text-sm text-gray-600">Name</div>
          <div className="font-medium">{user.name}</div>
        </div>
        <div className="mt-3">
          <div className="text-sm text-gray-600">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>
        <div className="mt-3">
          <div className="text-sm text-gray-600">Role</div>
          <div className="font-medium">{user.role}</div>
        </div>
      </div>
    </div>
  );
}
