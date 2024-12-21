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

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, handleLogout } = useAuth();
  const router = useRouter();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gray-50 shadow-sm px-5 lg:px-20 py-4 flex items-center justify-between lg:gap-20 sticky top-0 right-0 z-50">
      <Link href={"/"} className="flex gap-2 items-center">
        <SiLimesurvey size={30} className="text-[#4e8d99]" />
        <h1 className="text-lg font-bold text-primary">AI-Survey</h1>
      </Link>
      <div className="gap-2 items-center hidden md:flex text-[#4e8d99]">
        <Link href={"/"}>Home</Link>
        <Link href={"/about"}>About</Link>
        <Link href={"/contact"}>Contact</Link>
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
            <p>{currentUser?.username}</p>
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
          <>
            <Link
              href="/login"
              className="hidden lg:block border-gray-300 border px-4 py-2 rounded-xl hover:bg-[#4e8d99] hover:text-gray-50"
            >
              Login
            </Link>
            <Button
              size="small"
              onClick={() => router.push("/login")}
              text="Get Started"
              className="!rounded-xl !bg-[#4e8d99] !hover:bg-[#589eac]"
            />
          </>
        )}
      </div>

      {/* Dropdown Menu for large devices (below the header) */}
      {isDropdownOpen && (
        <div className="absolute top-20 right-5 bg-white shadow-md p-4 mt-2 rounded-md w-60 z-50">
          { currentUser && <div className="flex flex-col gap-2 justify-start">
            <Image
              height={40}
              width={40}
              src={currentUser?.image || "/user.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover object-center border-2 border-[#4e8d99]"
            />
            <p className="font-semibold text-lg">{currentUser?.username}</p>
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
              onClick={handleLogout}
              className="!rounded-xl !hover:bg-[#589eac]"
            />
          </div>}
            {!currentUser &&<div className="gap-2  items-center flex flex-col text-[#4e8d99] underline">
              <Link onClick={()=> setIsDropdownOpen(false)} href={"/"}>Home</Link>
              <Link onClick={()=> setIsDropdownOpen(false)} href={"/about"}>About</Link>
              <Link onClick={()=> setIsDropdownOpen(false)} href={"/contact"}>Contact</Link>
              {!currentUser && <Link className="text-[#6d445e]" onClick={()=> setIsDropdownOpen(false)} href={"/login"}>Login</Link>}
            </div>}
        </div>
      )}
    </header>
  );
}
