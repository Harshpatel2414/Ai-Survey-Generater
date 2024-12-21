// /components/TransactionTable.js
import React from "react";

const TransactionTable = () => {
  const transactions = [
    { id: 1, description: "Payment from User A", amount: 100, date: "2024-12-20", type: "Credit" },
    { id: 2, description: "Payment to User B", amount: 50, date: "2024-12-19", type: "Debit" },
  ];

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border">ID</th>
          <th className="px-4 py-2 border">Description</th>
          <th className="px-4 py-2 border">Amount</th>
          <th className="px-4 py-2 border">Date</th>
          <th className="px-4 py-2 border">Type</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td className="px-4 py-2 border">{transaction.id}</td>
            <td className="px-4 py-2 border">{transaction.description}</td>
            <td className="px-4 py-2 border">{transaction.amount}</td>
            <td className="px-4 py-2 border">{transaction.date}</td>
            <td className="px-4 py-2 border">{transaction.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
