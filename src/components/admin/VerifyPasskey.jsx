import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaSpinner } from "react-icons/fa";

const VerifyPasskey = () => {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setPasskeyVerified } = useAuth();

  const handleVerify = () => {
    setError("");
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      setPasskeyVerified(true);
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 p-5">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap- mb-4 w-full">
          <label className="text-gray-700 mb-4 text-center">
            Enter Admin Passkey
          </label>
          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full text-center p-2 border text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={handleVerify}
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
            "Verify Passkey"
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyPasskey;
