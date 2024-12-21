// /components/UserTable.js
import React from "react";

const UsersTable = () => {
  const users = [
    { id: 1, name: "User A", email: "userA@example.com", balance: 1000 },
    { id: 2, name: "User B", email: "userB@example.com", balance: 500 },
  ];

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border">ID</th>
          <th className="px-4 py-2 border">Name</th>
          <th className="px-4 py-2 border">Email</th>
          <th className="px-4 py-2 border">Balance</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-4 py-2 border">{user.id}</td>
            <td className="px-4 py-2 border">{user.name}</td>
            <td className="px-4 py-2 border">{user.email}</td>
            <td className="px-4 py-2 border">{user.balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
