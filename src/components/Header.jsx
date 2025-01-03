"use client";
import { FaBars } from "react-icons/fa6";
import { SiLimesurvey } from "react-icons/si";
import Button from "./common/Button";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, handleLogout } = useAuth();
  const router = useRouter();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gray-50 shadow-sm px-5 lg:px-20 py-4 flex items-center justify-between lg:gap-20 sticky top-0 right-0 z-50">
      <Link href={"/home"} className="flex gap-2 items-center">
        <SiLimesurvey size={30} className="text-[#4e8d99]" />
        <h1 className="text-lg font-bold text-primary">AI-Survey</h1>
      </Link>
      <div className="gap-5 items-center hidden md:flex text-[#4e8d99]">
        <Link className="hover:text-[#6d445e]" href={"/home"}>Home</Link>
        <Link className="hover:text-[#6d445e]" href={"/blogs"}>Blogs</Link>
        <Link className="hover:text-[#6d445e]" href={"/about"}>About</Link>
        <Link className="hover:text-[#6d445e]" href={"/contact"}>Contact</Link>
      </div>

      <div className="flex items-center flex-row-reverse gap-2">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-sm lg:hidden text-primary px-3 py-2 tracking-wide cursor-pointer"
        >
          <FaBars size={20} className="text-gray-500" />
        </button>

        {/* Show Profile Dropdown or Login / Get Started Button */}
        {currentUser ? (
          <div className="items-center gap-4 hidden lg:flex">
            <p className="capitalize font-semibold">{currentUser?.username}</p>
            <Image
              height={40}
              width={40}
              src={currentUser?.image || "/user.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover object-center border-2 border-[#4e8d99]"
            />
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 font-semibold"
            >
              {isDropdownOpen ? (
                <FaChevronUp size={20} />
              ) : (
                <FaChevronDown size={20} />
              )}
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex gap-2">
            <Link
              href="/login"
              className="border-gray-300 border px-4 py-2 rounded-xl hover:bg-[#4e8d99] hover:text-gray-50"
            >
              Login
            </Link>
            <Button
              size="small"
              onClick={() => router.push("/login")}
              text="Get Started"
              className="!rounded-xl !bg-[#4e8d99] !hover:bg-[#589eac]"
            />
          </div>
        )}
      </div>

      {/* Dropdown Menu for large devices (below the header) */}
      {isDropdownOpen && currentUser && (
        <div className="absolute top-20 right-5 bg-white shadow-md p-4 mt-2 rounded-md w-60 z-50">
          <div className="flex flex-col gap-2 justify-start">
            <div className="flex items-center gap-2 border-b pb-4">
            <Image
              height={40}
              width={40}
              src={currentUser?.image || "/user.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover object-center border-2 border-[#4e8d99]"
              />
            <p className="font-semibold text-lg capitalize flex-1 truncate">{currentUser?.username}</p>
              </div>
            <p className=" text-gray-500">
              Balance: ${currentUser?.walletAmount}
            </p>

            {/* Add Money to Wallet Button */}
            <button
              onClick={() => {
                router.push("/profile");
                setIsDropdownOpen(false);
              }}
              className="text-sm w-fit text-[#589eac] underline mb-2"
            >
              View Profile
            </button>

            {/* Logout Button */}
            <Button
              text="Logout"
              onClick={()=>{
                setIsDropdownOpen(false);
                toast.success("Logged out successfully");
                handleLogout();
              }
              }
              className="!rounded-xl !hover:bg-[#589eac]"
            />
          </div>
        </div>
      )}

      {/* Handle the case when logged out */}
      {isDropdownOpen && !currentUser && (
        <div className="absolute top-16 right-2 bg-white shadow-md mt-2 rounded-md w-60 z-50">
          <div className="flex flex-col gap-2 lg:hidden items-center text-[#4e8d99] m-4">
            <Link onClick={() => setIsDropdownOpen(false)} href={"/home"}>
              Home
            </Link>
            <Link onClick={() => setIsDropdownOpen(false)} href={"/blogs"}>
              Blogs
            </Link>
            <Link onClick={() => setIsDropdownOpen(false)} href={"/about"}>
              About
            </Link>
            <Link onClick={() => setIsDropdownOpen(false)} href={"/contact"}>
              Contact
            </Link>
            <Link
              className="text-[#6d445e]"
              onClick={() => setIsDropdownOpen(false)}
              href={"/login"}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
