"use client";
import React, { useState } from "react";

const TransactionTable = () => {
    let [loading, setLoading] = useState(false);
  const transactions = [
    {
      _id: 1,
      info: "Payment from User A",
      amount: 100,
      date: "2024-12-20",
      type: "credit",
    },
    {
      _id: 2,
      info: "Payment to User B",
      amount: 50,
      date: "2024-12-19",
      type: "debit",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 items-center bg-white drop-shadow-lg p-5 rounded-lg w-full min-h-96">
      <h2 className="text-2xl font-semibold text-gray-700">
        Transaction History
      </h2>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length > 0 ? (
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
                <td className="px-4 py-2">{transaction.info}</td>
                <td
                  className={`px-4 py-2 ${
                    transaction.type === "credit"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  ${transaction.amount}
                </td>
                <td className="px-4 py-2">{transaction.date}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    transaction.type === "credit"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionTable;
