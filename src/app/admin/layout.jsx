"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

const AdminLayout = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false); // State for OTP confirmation
  const [otp, setOtp] = useState(""); 
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (value.length <= 1) {
      const updatedOtp = otp.split("");
      updatedOtp[index] = value;
      setOtp(updatedOtp.join(""));
      // Focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleConfirm = () => {
    const correctOtp = "123456"; // Replace with your backend validation
    if (otp === correctOtp) {
      setIsAuthorized(true);
    } else {
      setError("Invalid OTP!");
    }
  };

  return (
    <div className="flex h-full">
      {!isAuthorized ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-00">
          <div className="bg-white rounded-lg p-6 w-96 drop-shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4 text-[#4e8d99]">Enter Admin Key</h2>
            <div className="flex justify-between mb-4">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 border-2 border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handleConfirm}
              className="w-full bg-[#4e8d99] text-white py-2 rounded hover:bg-[#60afbe]"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full">
          <Sidebar />
          {/* Main Content */}
          <div className="flex-1 w-full h-full flex bg-gray-100">{children}</div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
