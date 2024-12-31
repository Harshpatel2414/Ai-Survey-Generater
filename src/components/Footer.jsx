import Link from "next/link";
import React from "react";
import { SiLimesurvey } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="py-8 px-5 text-center text-gray-600 bg-white flex flex-col gap-5">
      <div className="flex gap-5 items-center md:justify-center">
        <SiLimesurvey size={30} className="text-[#4e8d99]" />
        <Link href={"/home"} className="text-lg font-bold text-primary">
          AI-Survey
        </Link>
      </div>
      <div className="flex flex-col gap-4 text-[#4e8d99] items-start md:flex-row md:justify-center md:gap-8 ">
        <Link href={"/about"} className="underline">
          About
        </Link>
        <Link href={"/contact"} className=" underline">
          Contact
        </Link>
        <Link href={"/privacy-policy"} className=" underline">
          Privacy
        </Link>
        <Link href={"/terms-and-conditions"} className=" underline">
          Terms & conditions
        </Link>
      </div>
      <p className="mt-4 md:mt-0">&copy; 2024 AI-Survey</p>
    </footer>
  );
};

export default Footer;
