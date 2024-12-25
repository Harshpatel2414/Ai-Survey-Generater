"use client";
import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import { useAdmin } from "@/context/AdminContext";
import AdminLogin from "@/components/admin/AdminLogin";
import Loading from "../loading";

const AdminLayout = ({ children }) => {
  const { currentAdmin,loading } = useAdmin();

  if(loading) return <Loading />
  
  return !currentAdmin ? (
    <AdminLogin />
  ) : (
    <div className="flex flex-col md:flex-row h-full w-full">
      <Sidebar />
      <div className="flex-1 w-full h-full flex bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
