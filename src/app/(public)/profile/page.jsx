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
import { useRouter } from "next/navigation";
import Checkout from "@/components/payment/Checkout";

// Load Stripe with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const ProfilePage = () => {
  const [amount, setAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) return;
    const fetchTransactions = async () => {
      setTransactionLoading(true);
      try {
        const response = await fetch(`/api/transactions/${currentUser._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setTransactions(data.transactions);
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
    if (amount < 10) {
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

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center pb-10">
      {/* Wallet Summary - Only visible when not adding money */}
      <div className="bg-[#4e8d99] w-full h-80 flex flex-col items-center justify-center py-10 gap-4">
        <Image
          src={currentUser?.image || "/user.png"}
          alt="avatar"
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-center object-cover border-2 border-white"
        />
        <div className="items-center flex flex-col gap-2">
          <p className="text-white text-lg font-semibold">{currentUser?.username}</p>
          <p className="text-gray-300 ">{currentUser?.email}</p>
        </div>
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
              <label htmlFor="amount" className="text-sm font-medium text-gray-600">
                Enter Amount
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="p-2 outline-none border border-[#4e8d99] rounded-md w-full md:w-80"
                min="10"
              />
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
            <h2 className="text-2xl font-semibold text-gray-700">Complete Payment</h2>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "stripe" },
              }}
            >
              <Checkout amount={amount} clientSecret={clientSecret} userId={currentUser._id} />
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
        <div className="flex flex-1 flex-col gap-4 overflow-x-auto bg-white drop-shadow-lg p-5 rounded-lg w-full ">
          <h2 className="text-2xl font-semibold text-gray-700">Transaction History</h2>
          {transactionLoading ? (
            <Loading />
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto w-full flex">
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
      </div>
    </div>
  );
};

export default ProfilePage;
