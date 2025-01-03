"use client";
import React, { useState, useEffect } from "react";
import { FaDollarSign, FaSearch, FaUser, FaWallet } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import Cookies from "js-cookie";
import Loading from "@/app/loading";
import StatCard from "@/components/admin/StatCard";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transactionsData, setTransactionsData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [updatingLandingPage, setUpdatingLandingPage] = useState(false);
  const { currentUser } = useAuth();
  let csrfToken = Cookies.get("csrf-token");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/transactions/stats`, {
        method: "GET",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactionsData(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(`/api/admin/users/stats`, {
        method: "GET",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsersData(data);
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

  const handleUpdateLandingPage = async (e) => {
    e.preventDefault();
    try {
      setUpdatingLandingPage(true);
      const response = await fetch(`/api/admin/landing-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          title,
          description
        }),
      });
      if (!response.ok) toast.error("Failed to update landing page");
      toast.success("Landing page updated successfully");
      setTitle("")
      setDescription("")
      setUpdatingLandingPage(false);
    } catch (error) {
      console.error("Error updating landing page:", error);
    }
  }

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll hide-scrollbar bg-white pb-10">
      <div className="flex flex-col md:flex-row gap-4 md:items-center p-5">
        <div className="flex flex-1 flex-col gap-2 drop-shadow-md">
          <h1 className="text-2xl font-bold text-[#4e8d99] tracking-wider">
            Dashboard
          </h1>
          <p className="capitalize">Welcome, {currentUser?.username}!</p>
        </div>
        <div className="border bg-white rounded-lg h-10 flex items-center gap-2 p-2 drop-shadow-sm">
          <FaSearch className="w-6 h-6 text-gray-300" />
          <input
            type="text"
            placeholder="Search"
            className="w-full md:max-w-sm outline-none bg-transparent"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            key={1}
            icon={<FaUser size={24} />}
            title={"Total Users"}
            value={usersData?.totalUsers || 0}
          />
          <StatCard
            key={2}
            icon={<FaWallet size={24} />}
            title={"Total Transactions"}
            value={transactionsData?.totalTransactions || 0}
          />
          <StatCard
            key={3}
            icon={<FaDollarSign size={24} />}
            title={"Revenue"}
            value={transactionsData?.totalRevenue || 0}
          />
          <StatCard
            key={5}
            icon={<FaMoneyBillTrendUp size={24} />}
            title={"Average Spend"}
            value={transactionsData?.averageTransaction || 0}
          />
        </div>
        <div className="flex flex-col items-center gap-4 py-10">
          <h1 className="text-2xl text-[#4e8d99]">Landing Page Information</h1>
          <form className="flex flex-col gap-4 w-full md:w-3/4 bg-white p-5 rounded-lg drop-shadow-md">
            <div className="flex gap-2 flex-col">
              <label className="text-lg text-[#4e8d99]">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border resize-none border-[#4e8d99] rounded-lg outline-none text-gray-600"
              />
            </div>
            <div className="flex gap-2 flex-col">
              <label className="text-lg text-[#4e8d99]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="p-2 border resize-none border-[#4e8d99] rounded-lg outline-none text-gray-600"
              />
            </div>
            <button onClick={handleUpdateLandingPage} className="bg-[#4e8d99] px-4 py-2 rounded-lg text-white">
              {updatingLandingPage ? "Updating..." : "Update"}
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white drop-shadow-lg p-5 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Latest Transactions
          </h2>
          {loading ? (
            <Loading />
          ) : transactionsData?.transactions?.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full min-h-80 text-sm text-left text-gray-500">
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
                  {transactionsData?.transactions?.map((transaction, index) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 truncate">
                        {transaction.paymentIntentId}
                      </td>
                      <td
                        className={`px-4 py-2 truncate ${
                          transaction.transactionType === "credit"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        ${transaction.amount}
                      </td>
                      <td className="px-4 py-2 truncate ">
                        {transaction.transactionDate}
                      </td>
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
            Most Active Users
          </h2>
          {usersLoading ? (
            <Loading />
          ) : usersData?.users.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Sr.No</th>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">Blocked</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((user, index) => (
                    <tr key={user._id} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 truncate">{user._id}</td>
                      <td className="px-4 py-2 capitalize truncate">
                        {user.username}
                      </td>
                      <td className="px-4 py-2 truncate">{user.email}</td>
                      <td className="px-4 py-2">${user.walletAmount}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          user.blocked ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {user.blocked ? `Yes` : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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