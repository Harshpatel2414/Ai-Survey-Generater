"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Extract parameters from the URL using searchParams
  const amount = searchParams.get("amount");
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  useEffect(() => {
    // If payment is unsuccessful or missing necessary data, show an error
    if (!paymentIntentId || !redirectStatus || redirectStatus !== "succeeded") {
      toast.error("Payment failed or invalid redirect status.");
      router.push("/profile");
      return;
    }

    // Prepare transaction data to be sent to the backend
    const transactionData = {
      paymentIntentId,
      amount: parseInt(amount),
      userId,
      email,
      date: new Date().toISOString(),
    };

    // Function to call the backend API to complete payment
    const completePayment = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/payment/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        });

        if (response.ok) {
         await refreshUser();
          toast.success("Transaction completed and wallet updated!");
        } else {
            toast.error("Error completing payment.");
        }
    } catch (error) {
        toast.error("Failed to complete payment.");
        console.error("Error:", error);
    } finally {
        setLoading(false);
        router.push("/profile");  // Redirect to the wallet after success
      }
    };

    completePayment(); // Call the function to complete payment
  }, [paymentIntentId, redirectStatus, router, amount, userId, email]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="bg-white p-6 rounded text-center">
        <h1 className="text-2xl font-bold text-[#4e8d99]">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">Transaction ID: {paymentIntentId}</p>
        <Image src="/success1.png" width={200} height={180} alt="Success" />
        <p className="text-2xl font-semibold text-[#4e8d99]">${amount}</p>
        <p className="text-gray-500 text-sm">{new Date().toLocaleString()}</p>
        <button
          onClick={() => router.push("/wallet")}
          className="mt-4 bg-[#4e8d99] text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Wait..." : "Go to Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Success;
