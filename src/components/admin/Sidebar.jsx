"use client";
import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
} from "react-icons/fa"; // Importing React Icons
import Link from "next/link"; // Importing Link from Next.js

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // State to handle collapse

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col bg-[#4e8d99] text-white ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 drop-shadow-lg`}
    >
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-400 py-5">
        <h2
          className={`text-xl font-semibold ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          Admin Panel
        </h2>
        <button onClick={toggleSidebar} className="text-white">
        {isCollapsed ? (
            <FaChevronRight size={24} />
          ) : (
            <FaChevronLeft size={24} />
          )}
        </button>
      </div>
      <div className="space-y-4 p-2 w-full">
        <div>
          <Link
            href="/admin"
            className="flex items-center gap-4 rounded hover:bg-[#60afbe] p-2"
          >
            <FaHome size={24} />
            {!isCollapsed && <span>Home</span>}
          </Link>
        </div>

        <div>
          <Link
            href="/admin/transactions"
            className="flex items-center gap-4 rounded hover:bg-[#60afbe] p-2"
          >
            <FaExchangeAlt size={24} />
            {!isCollapsed && <span>Transactions</span>}
          </Link>
        </div>
        <div>
          <Link
            href="/admin/users"
            className="flex items-center gap-4 rounded hover:bg-[#60afbe] p-2"
          >
            <FaUsers size={24} />
            {!isCollapsed && <span>Users</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
