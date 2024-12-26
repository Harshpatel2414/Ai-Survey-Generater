"use client";
import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminLogin from "@/components/admin/AdminLogin";
import { useAuth } from "@/context/AuthContext";
import VerifyPasskey from "@/components/admin/VerifyPasskey";

const AdminLayout = ({ children }) => {
  const { currentUser, isPasskeyVerified } = useAuth();
  if (!currentUser || currentUser?.role !== "admin") {
    return <AdminLogin />;
  }
  if (!isPasskeyVerified) {
    return <VerifyPasskey />;
  }
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <Sidebar />
      <div className="flex-1 w-full h-full flex bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
