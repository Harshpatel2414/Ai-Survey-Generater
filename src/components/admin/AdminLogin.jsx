"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaLock, FaSpinner, FaUser } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { SiLimesurvey } from "react-icons/si";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if(res.ok){
        if (data.user?.role !== "admin") {
          setError("Not an admin account! please login with an admin details");
          return;
        }
        setCurrentUser(data.user);
      }else{
        setError( data.message || "Invalid email or password");
        return;
      }
      toast.success("Admin login successful");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col gap-5 justify-center h-screen bg-gray-100 p-5">
      <div className="flex items-center justify-center">
        <SiLimesurvey className="text-5xl text-[#4e8d99] text-center" />
        <h1 className="text-2xl font-bold text-[#4e8d99] text-center">
          AI-Survey Admin
        </h1>
      </div>
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
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
            {error && <p className="text-red-500 mb-1 text-sm">{error}</p>}
            <Link href="/forgot-password" className="text-[#4e8d99] text-sm">
              Forgot Password?
            </Link>
          </div>
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
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
