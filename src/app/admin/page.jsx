"use client";
import React, { useState, useEffect } from "react";
import {
  FaDollarSign,
  FaHourglassHalf,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { SiLimesurvey } from "react-icons/si";
import Loading from "../loading";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [transactionPage, setTransactionPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  const itemsPerPage = 10;

  const stats = [
    {
      title: "Total Users",
      value: 1500,
      icon: <FaUser size={24} />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Transactions",
      value: 3200,
      icon: <FaWallet size={24} />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: "$45,000",
      icon: <FaDollarSign size={24} />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Pending Requests",
      value: 75,
      icon: <FaHourglassHalf size={24} />,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const { transactions } = await response.json();
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(`/api/user`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll hide-scrollbar">
    <div className="flex items-center gap-2 bg-white p-5 drop-shadow-md">
      <SiLimesurvey size={30} className="text-[#4e8d99]" />
      <h1 className="text-lg font-bold text-primary">AI-Survey</h1>
    </div>
    <div className="flex flex-col gap-4 p-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center p-4 rounded-lg drop-shadow-lg ${stat.bg}`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.color} bg-white shadow-inner mr-4`}
            >
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="flex flex-1 flex-col gap-4 overflow-x-auto bg-white drop-shadow-lg p-5 rounded-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-700">Transaction History</h2>
        {loading ? (
          <Loading />
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Sr. No.</th>
                  <th className="px-4 py-2">Info</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{transaction.paymentIntentId}</td>
                    <td
                      className={`px-4 py-2 ${
                        transaction.transactionType === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ${transaction.amount}
                    </td>
                    <td className="px-4 py-2">{transaction.transactionDate}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        transaction.transactionType === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.transactionType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
        {/* Users Section */}
        <div className="bg-white drop-shadow-lg p-5 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Active Users
          </h2>
          {usersLoading ? (
            <Loading  />
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
                    {paginate(users, userPage).map((user) => (
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
              <div className="flex justify-center mt-4">
                {Array.from({
                  length: Math.ceil(users.length / itemsPerPage),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setUserPage(i + 1)}
                    className={`px-3 py-1 mx-1 rounded ${
                      userPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
