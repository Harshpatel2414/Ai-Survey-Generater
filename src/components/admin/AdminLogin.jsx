"use client";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { FaLock, FaSpinner, FaUser } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { setCurrentAdmin } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (step === 1) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        setResponse(res);
        if (!res.ok) {
          const { message } = await res.json();
          toast.error(message);
        } else {
          setStep(2);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      try {
        if (otp === process.env.NEXT_PUBLIC_ADMIN_OTP) {
          const { user } = await response.json();
          if (user.isAdmin === false) {
            setError("Invalid Admin Key");
            return;
          }
          setCurrentAdmin(user);
        } else {
          setError("Invalid Admin Key");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          {step === 1 ? "Admin Login" : "Enter OTP"}
        </h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
                    required
                  />
                </div>
              </div>

              <div className="mt-2">
                <Link
                  href="/forgot-password"
                  className="text-[#4e8d99] text-sm"
                >
                  Forgot Password?
                </Link>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="mb-4 relative">
              <button
                onClick={() => setStep(1)}
                className="absolute -top-0 right-4 underline"
              >
                Back
              </button>
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                Enter Admin Passkey
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
              />
            </div>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full mt-2 py-2 px-4 bg-[#4e8d99] text-white rounded-md hover:bg-[#65a4b0]${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin w-5 h-5 text-white" />
              </div>
            ) : step === 1 ? (
              "Login"
            ) : (
              "Verify Passkey"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
