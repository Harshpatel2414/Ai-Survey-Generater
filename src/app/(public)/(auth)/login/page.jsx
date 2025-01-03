"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import Cookies from "js-cookie";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, setCurrentUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Zod validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setLoading(false);
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setCurrentUser(result.user);
        router.push("/home");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    router.push("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-20">
      <div className="p-6 bg-white rounded-lg shadow-md shadow-zinc-100 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
          Login
        </h2>
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
            <div className="mt-2">
              <Link href="/forgot-password" className="text-[#4e8d99] text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-[#4e8d99] text-white rounded-md ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <FaSpinner className="animate-spin w-6 h-6 text-gray-100" />
              </div>
            ) : (
              "Login"
            )}
          </button>
          <div className="mt-4 text-center">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#4e8d99] underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
