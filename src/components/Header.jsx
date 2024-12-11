"use client";
import { FaBars } from "react-icons/fa6";
import { SiLimesurvey } from "react-icons/si";
import Button from "./common/Button";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-50 shadow-sm px-5 lg:px-20 py-4 flex items-center justify-between lg:gap-20 sticky top-0 right-0 z-50">
      <div className="flex gap-2 items-center">
        <SiLimesurvey size={30} className="text-[#4e8d99]" />
        <h1 className="text-lg font-bold text-primary">AI-Survey</h1>
      </div>
      {/* Dropdown Menu for Mobile */}
      <div
        className={`${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        } flex-1 flex flex-col p-5 drop-shadow-md lg:drop-shadow-none lg:p-0 rounded-lg lg:opacity-100 lg:translate-y-0 lg:transition-none rounded-t-none justify-start items-start z-10 gap-4 absolute lg:static top-full right-0 lg:flex-row bg-white lg:bg-transparent w-full transition-all duration-500 ease-in-out`}
      >
        <button>Pricing</button>
        <button className="text-[#6d445e]">AI Survey Examples</button>
      </div>

      <div className="flex items-center flex-row-reverse gap-2">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm lg:hidden text-primary px-3 py-2 tracking-wide"
        >
          <FaBars size={20} className="text-gray-500" />
        </button>

        {/* Login Button */}
        <button className="hidden lg:block border-gray-300 border px-4 py-2 rounded-xl hover:bg-[#4e8d99] hover:text-gray-50">
          Login
        </button>

        {/* Get Started Button */}
        <Button
          size="small"
          text="Get Started"
          className="!rounded-xl !bg-[#4e8d99] !hover:bg-[#589eac]"
        />
      </div>
    </header>
  );
}
