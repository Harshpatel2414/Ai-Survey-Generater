"use client";

import Loading from "@/app/loading";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSync } from "react-icons/fa";

const usersPerPage = 10;

const Modal = ({
  isVisible,
  onClose,
  onSubmit,
  user,
  reason,
  setReason,
  action,
}) => {
  if (!isVisible) return null;

  return (
    <div className="p-5 inset-0 absolute top-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          <span className="capitalize">{action}</span> User - {user?.username}
        </h2>
        <textarea
          value={reason}
          rows={3}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Enter reason to ${action} user...`}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={`px-4 py-2 ${action === "block" ?"bg-red-500" : "bg-[#4e8d99]"  } text-white rounded-md hover:opacity-80`}
          >
            {action === "block" ? "Block" : "Unblock"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  let csrfToken = Cookies.get("csrf-token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users",{
        method: "GET",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      const data = await response.json();
      console.log("data >>>", data)
      setUsers(data);
      setLoading(false);
      setDisplayedUsers(data.slice(0, usersPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePagination = (page) => {
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = page * usersPerPage;
    setDisplayedUsers(users.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  const openModal = (user, action) => {
    setSelectedUser(user);
    setAction(action);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setAction("");
    setBlockReason("");
  };

  const handleBlockUser = async () => {
    if (!blockReason.trim()) {
      alert("Reason cannot be empty!");
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          action: action,
          reason: blockReason,
        }),
      });

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user._id === selectedUser._id
            ? { ...user, blocked: true, blockReason }
            : user
        );
        setUsers(updatedUsers);
        setDisplayedUsers(
          updatedUsers.slice(
            (currentPage - 1) * usersPerPage,
            currentPage * usersPerPage
          )
        );
        toast.success("User blocked successfully!");
      } else {
        toast.error("Failed to block user.");
      }

      closeModal();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user.");
    }
  };

  return (
    <div className="bg-white drop-shadow-lg rounded-lg w-full overflow-y-auto pb-10">
      <div className="flex items-center justify-between p-4 ">
        <h2 className="text-2xl font-semibold text-[#4e8d99]">Active Users</h2>
        <button
          onClick={fetchUsers}
          className="flex items-center border gap-2 px-3 py-1 rounded-md hover:bg-[#60afbe]"
        >
          <FaSync className="w-4 h-4 text-gray-300" />
          <span className="text-gray-600">Reload</span>
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {displayedUsers.length > 0 ? (
            <div className="overflow-x-auto p-4">
              <table className="min-w-full border-collapse text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr className="border-b">
                    <th className="px-6 py-3">Sr.No.</th>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Balance</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-3">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </td>
                      <td className="px-6 py-3">{user._id}</td>
                      <td className="px-6 py-3 capitalize w-fit">
                        {user.username}
                      </td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">
                        ${user.walletAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 text-sm font-medium rounded-lg ${
                            user.blocked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {user.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() =>
                            openModal(user, user.blocked ? "unblock" : "block")
                          }
                          className={`w-20 px-3 py-1 text-white rounded-lg font-medium shadow-sm transition-transform transform  ${
                            user.blocked
                              ? "bg-[#4e8d99] hover:bg-[#60afbe]"
                              : "bg-red-500 hover:bg-red-400"
                          }`}
                        >
                          {user.blocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <p className="py-1 px-3 rounded-md border">{currentPage}</p>
            <button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage === Math.ceil(users.length / usersPerPage)}
              className="px-3 py-1 mx-1 bg-[#4e8d99] text-white rounded-md hover:bg-[#659da8] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      <Modal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleBlockUser}
        user={selectedUser}
        reason={blockReason}
        action={action}
        setReason={setBlockReason}
      />
    </div>
  );
};

export default Users;
