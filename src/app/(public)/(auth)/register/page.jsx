"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

const RegisterPage = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
    termsAccepted: false, // Added field for terms acceptance
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size < 2 * 1024 * 1024) {
      setImgError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImgError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push("/profile?newUser=true");
        setCurrentUser(result.user);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full pt-20 p-4 bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md shadow-zinc-100 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Image Upload */}
          <div className="mb-4 flex items-center w-full">
            <label
              className="flex w-full justify-center items-center text-gray-700 mb-2"
              htmlFor="image"
            >
              <div className="flex flex-col justify-center w-full items-center">
                <Image
                  height={64}
                  width={64}
                  src={imagePreview || "/user.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover object-center border-2 border-[#4e8d99]"
                />
                {imgError ? (
                  <span className="text-red-400 text-sm">
                    Upload image less than 2mb
                  </span>
                ) : (
                  <span className="capitalize mt-1 text-sm underline text-[#4e8d99]">
                    {imagePreview ? "Change" : "Upload Profile"}
                  </span>
                )}
              </div>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full hidden pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
            />
          </div>

          {/* Form Fields */}
          <div className="mb-4 relative">
            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
            />
          </div>
          <div className="mb-4 relative">
            <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
            />
          </div>
          <div className="mb-4 relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
            />
          </div>
          <div className="mb-4 relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="termsAccepted" className="text-sm">
              I agree to the{" "}
              <Link
                href="/terms-and-conditions"
                className="text-[#4e8d99] underline"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full item-center py-2 px-4 bg-[#4e8d99] text-white rounded-md ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <FaSpinner className="animate-spin w-6 h-6 text-gray-100" />
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-[#4e8d99] underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default RegisterPage;
