"use client";

import Loading from "@/app/loading";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSync } from "react-icons/fa";

const transactionsPerPage = 10;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  let csrfToken = Cookies.get("csrf-token");

  useEffect(() => {
    fetchTransactions();
  },[]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/transactions",{
        method: "GET",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
      setDisplayedTransactions(data.slice(0, transactionsPerPage));
    } catch (error) {
      toast.error("Failed to load transactions.");
    }
  };

  const handlePagination = (page) => {
    const startIndex = (page - 1) * transactionsPerPage;
    const endIndex = page * transactionsPerPage;
    setDisplayedTransactions(transactions.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full overflow-y-auto pb-10">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-semibold text-[#4e8d99]">Transactions</h2>
        <button
          onClick={fetchTransactions}
          className="flex items-center border gap-2 px-3 py-1 rounded-md hover:bg-[#60afbe] transition-colors"
        >
          <FaSync className="w-4 h-4 text-gray-300" />
          <span className="text-gray-600">Reload</span>
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {displayedTransactions.length > 0 ? (
            <div className="overflow-x-auto p-4">
              <table className="min-w-full border-collapse text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr className="border-b">
                    <th className="px-6 py-3">Sr. No.</th>
                    <th className="px-6 py-3">Payment Info</th>
                    <th className="px-6 py-3">User Email</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Transaction Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 ">
                  {displayedTransactions.map((transaction,index) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">{((currentPage-1) *10) + (index+1)}</td>
                      <td className="px-6 py-4">{transaction.paymentIntentId}</td>
                      <td className="px-6 py-4">{transaction._id}</td>
                      <td className={`px-6 py-4 ${transaction.transactionType ==="debited" ? "text-red-500":"text-[#4e8d99]"}`}>${transaction.amount}</td>
                      <td className="px-6 py-4">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 capitalize ${transaction.transactionType ==="debited" ? "text-red-500":"text-[#4e8d99]"}`}>{transaction.transactionType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No transactions found.</p>
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
              disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)}
              className="px-3 py-1 mx-1 bg-[#4e8d99] text-white rounded-md hover:bg-[#659da8] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;
