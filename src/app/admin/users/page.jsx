"use client";
import Loading from "@/app/loading";
import React, { useState } from "react";

const UsersTable = () => {
  const [loading, setLoading] = useState(false);
  const users = [
    { _id: 1, username: "User A", email: "userA@example.com", walletAmount: 1000 },
    { _id: 2, username: "User B", email: "userB@example.com", walletAmount: 500 },
  ];

  return (
    <div className="bg-white drop-shadow-lg p-5 rounded-lg w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Active Users
          </h2>
          {loading ? (
            <Loading />
          ) : users.length > 0 ? (
            <div className="w-full">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="px-4 py-2">{user._id}</td>
                        <td className="px-4 py-2">{user.username}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.walletAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
  );
};

export default UsersTable;
