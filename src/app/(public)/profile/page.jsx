"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FaWallet } from "react-icons/fa6";
import convertToSubcurrency from "@/utils/convertToSubcurrency";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Loading from "../../loading";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Checkout from "@/components/payment/Checkout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const ITEMS_PER_PAGE = 10;

const ProfilePage = () => {
  const [amount, setAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newUser = searchParams.get("newUser");
  const amountNeeded = searchParams.get("amountNeeded");

  useEffect(() => {
    if(amountNeeded) setAmount(amountNeeded);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchTransactions = async () => {
      setTransactionLoading(true);
      try {
        const response = await fetch(`/api/transactions/${currentUser._id}`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Unable to load transaction history.");
      } finally {
        setTransactionLoading(false);
      }
    };

    if (currentUser) fetchTransactions();
  }, [currentUser]);

  // Create Payment Intent
  const createPaymentIntent = async (e) => {
    e.preventDefault();
    setError(false);

    if (Number(amount) < 10) {
      setError(true);
      toast.error("Minimum transaction amount is $10.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent.");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setIsAddingMoney(true);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center pb-10">
      {/* Wallet Summary - Only visible when not adding money */}
      <div className="bg-[#4e8d99] w-full h-fit flex flex-col items-center justify-center py-16 gap-4">
        <Image
          src={currentUser?.image || "/user.png"}
          alt="avatar"
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-center object-cover border-2 border-white"
        />
        <div className="items-center flex flex-col gap-2">
          <p className="text-white text-lg font-semibold capitalize">
            {currentUser?.username}
          </p>
          <p className="text-gray-300">{currentUser?.email}</p>
        </div>
        {newUser === "true" && (
          <div className=" p-4 rounded-md w-full text-center mb-5">
            <p className="text-white text-lg ">
              Add money to your wallet to generate a survey.
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center flex-col gap-5 w-full px-5 md:px-10 lg:px-20 -translate-y-10">
        {!isAddingMoney && (
          <div className="flex flex-col  gap-4 items-center justify-center bg-white drop-shadow-lg p-5 rounded-lg w-full md:w-96 mx-5">
            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="flex items-center flex-col gap-2">
                <FaWallet size={50} color="#4e8d99" />
              </div>
              <div className="text-left">
                <p className="text-3xl text-[#4e8d99] font-semibold">
                  ${currentUser?.walletAmount || 0}
                </p>
                <p className="text-lg text-gray-500">Total Balance</p>
              </div>
            </div>
            <form className="flex items-center flex-1 flex-col gap-2 w-full ">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-gray-600"
              >
                Enter Amount
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className={`p-2 outline-none border ${error ? "border-red-500" : "border-[#4e8d99]"}  rounded-md w-full md:w-80 text-center`}
              />
              <p className={error? "text-red-500":"text-gray-500"}>Minimum transaction amount is $10</p>
              <button
                onClick={(e) => createPaymentIntent(e)}
                className="bg-[#4e8d99] text-white py-2 px-4 rounded-md w-full md:w-80 mt-2"
              >
                {loading ? "Processing..." : "Add Money"}
              </button>
            </form>
          </div>
        )}

        {/* Add Money Section - Only visible when adding money */}
        {isAddingMoney && (
          <div className="flex flex-col w-full md:w-96 gap-4 items-center bg-white drop-shadow-lg p-5 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700">
              Complete Payment
            </h2>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "stripe" },
              }}
            >
              <Checkout
                amount={amount}
                clientSecret={clientSecret}
                userId={currentUser._id}
              />
            </Elements>
            <button
              onClick={() => {
                setIsAddingMoney(false);
                setAmount(0);
                setClientSecret("");
              }}
              className="text-[#4e8d99] underline text-sm mt-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Transactions Section */}
        <div className="flex flex-1 flex-col gap-4 overflow-x-auto bg-white drop-shadow-lg p-5 rounded-lg w-full">
          <h2 className="text-2xl font-semibold text-gray-700">
            Transaction History
          </h2>
          <div className="min-h-96 w-full h-full flex-1">
            {transactionLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : paginatedTransactions.length > 0 ? (
              <div className="overflow-x-auto w-full flex h-full">
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
                    {paginatedTransactions.map((transaction, index) => (
                      <tr key={transaction._id} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">
                          {transaction.paymentIntentId}
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            transaction.transactionType === "credit"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          ${transaction.amount}
                        </td>
                        <td className="px-4 py-2">
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
           {/* Pagination */}
           <div className="flex items-center justify-center gap-4 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">{currentPage}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
