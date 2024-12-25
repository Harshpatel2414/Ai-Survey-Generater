// "use client";
// import React, { useState } from "react";
// import {
//   FaBars,
//   FaHome,
//   FaUsers,
//   FaChevronLeft,
//   FaChevronRight,
//   FaExchangeAlt,
// } from "react-icons/fa"; // Importing React Icons
// import Link from "next/link"; // Importing Link from Next.js

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(true); // State to handle collapse

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div
//       className={`flex flex-col bg-[#4e8d99] text-white ${
//         isCollapsed ? "w-16" : "w-64"
//       } transition-all duration-300 drop-shadow-lg`}
//     >
//       <div className="flex justify-between items-center p-4 border-b-2 border-gray-400 py-5">
//         <h2
//           className={`text-xl font-semibold ${
//             isCollapsed ? "hidden" : "block"
//           }`}
//         >
//           Admin Panel
//         </h2>
//         <button onClick={toggleSidebar} className="text-white">
//         {isCollapsed ? (
//             <FaChevronRight size={24} />
//           ) : (
//             <FaChevronLeft size={24} />
//           )}
//         </button>
//       </div>
//       <div className="space-y-4 p-2 w-full">
//         <div>
//           <Link
//             href="/admin"
//             className="flex items-center gap-4 rounded hover:bg-[#60afbe] p-2"
//           >
//             <FaHome size={24} />
//             {!isCollapsed && <span>Home</span>}
//           </Link>
//         </div>

//         <div>
//           <Link
//             href="/admin/transactions"
//             className="flex items-center gap-4 rounded hover:bg-[#60afbe] p-2"
//           >
//             <FaExchangeAlt size={24} />
//             {!isCollapsed && <span>Transactions</span>}
//           </Link>
//         </div>
//         <div>
//           <Link
//             href="/admin/users"
//             className="flex items-center gap-4 rounded hover:bg-[#60afbe] p-2"
//           >
//             <FaUsers size={24} />
//             {!isCollapsed && <span>Users</span>}
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiHelpCircle,
  FiSettings,
  FiHeadphones,
  FiLogOut,
} from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GrTransaction } from "react-icons/gr";
import { LuUsers } from "react-icons/lu";
import { RiCloseFill } from "react-icons/ri";
import { SiLimesurvey } from "react-icons/si";
import { useAdmin } from "@/context/AdminContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const { currentAdmin,logOut} = useAdmin();
  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully");
  };
  const menuItems = [
    {
      icon: <HiOutlineSquares2X2 className='text-xl' />,
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: <GrTransaction className="text-lg" />,
      label: "Transactions",
      path: "/admin/transactions",
    },
    {
      icon: <LuUsers className="text-lg" />,
      label: "Users",
      path: "/admin/users",
    },
    {
      icon: <FiHelpCircle className="text-lg" />,
      label: "How to Use",
      path: "/admin/how-to-use",
    },
    {
      icon: <FiSettings className="text-lg" />,
      label: "Settings",
      path: "/admin/settings",
    },
    {
      icon: <FiHeadphones className="text-lg" />,
      label: "Support",
      path: "/admin/support",
    },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-r flex flex-col relative drop-shadow-md z-10">
      <div className=" border-b flex flex-col w-full p-4">
        <div className="flex items-center gap-2 w-full h-fit">
          <div className="flex flex-1 w-full items-center gap-2 cursor-pointer">
            <SiLimesurvey size={34} className="text-[#4e8d99]" />
            <Link href={"/"} className="text-xl font-semibold">
              AI-Survey
            </Link>
          </div>
          {showMenu ? (
            <RiCloseFill onClick={() => setShowMenu(!showMenu)} size={24} />
          ) : (
            <FaBars
              onClick={() => setShowMenu(!showMenu)}
              size={24}
              className="block text-[#4e8d99] md:hidden text-2xl"
            />
          )}
        </div>
      </div>
      <div
        className={`${
          showMenu
            ? "block absolute z-50 top-full w-full bg-white drop-shadow-md"
            : "hidden md:flex"
        } md:flex flex-col flex-1 p-4 `}
      >
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    pathname === item.path
                      ? "bg-[#a7ece9] text-gray-600 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="text-gray-700">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-2 border-t flex items-center gap-2 w-full">
            <Image
              src={currentAdmin ? currentAdmin?.image : "/user.png"}
              alt="User"
              width={32}
              height={32}
              className="border-2 h-8 w-8 rounded-full object-center object-cover"
            />
            <p className="w-full flex-1 truncate capitalize">{currentAdmin?.username}</p>
            <FiLogOut onClick={handleLogout} size={20} className="hover:bg-gray-100 h-8 w-8 p-2 rounded-md cursor-pointer"/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
