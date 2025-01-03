"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import Cookies from "js-cookie";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { setIsProcessPayment } = useAppContext();
  const [loading, setLoading] = useState(false);
 
  // Extract parameters from the URL using searchParams
  const amount = searchParams.get("amount");
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");
  const date = searchParams.get("date");
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  useEffect(() => {
    // If payment is unsuccessful or missing necessary data, show an error
    if (!paymentIntentId || !redirectStatus || redirectStatus !== "succeeded") {
      toast.error("Payment failed or invalid redirect status.");
      router.push("/profile");
      return;
    }

    const paymentProcessed = localStorage.getItem("paymentProcessed");
    if (paymentProcessed === "true") {
      router.push("/profile");
      return;
    }

    // Prepare transaction data to be sent to the backend
    const transactionData = {
      paymentIntentId,
      amount: parseInt(amount),
      userId,
      email,
      date: date,
    };

    // Function to call the backend API to complete payment
    const completePayment = async () => {
      setLoading(true);
      let csrfToken = Cookies.get("csrf-token");
      try {
        const response = await fetch("/api/payment/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(transactionData),
        });

        if (response.ok) {
          await refreshUser();
          toast.success("Transaction completed and wallet updated!");

          // Mark payment as processed (store in localStorage)
          localStorage.setItem("paymentProcessed", "true");
                  } else {
          toast.error("Error completing payment.");
        }
      } catch (error) {
        toast.error("Failed to complete payment.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
        setIsProcessPayment(true);
        router.push("/home");
      }
    };

    completePayment(); // Call the function to complete payment
  }, [amount, date, userId, email, paymentIntentId, redirectStatus, router, refreshUser, setIsProcessPayment]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="bg-white p-6 rounded text-center flex flex-col items-center justify-center w-96">
        <h1 className="text-2xl font-bold text-[#4e8d99]">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">Transaction ID: {paymentIntentId}</p>
        <Image src="/success1.png" width={200} height={180} alt="Success" />
        <p className="text-2xl font-semibold text-[#4e8d99]">${amount}</p>
        <p className="text-gray-500 text-sm">{date}</p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-4 bg-[#4e8d99] text-white px-4 py-2 rounded w-80"
          disabled={loading}
        >
          {loading ? "Wait..." : "Go to Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Success;
