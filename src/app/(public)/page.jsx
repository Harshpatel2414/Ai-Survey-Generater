"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiLimesurvey } from "react-icons/si";
import { FaArrowRight, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

const LandingPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const heading = "AI Survey Generator";
  const description =
    "Create surveys effortlessly with the power of AI. Get started now and gather valuable insights in no time.";

  const handleStartNow = () => {
    router.push("/home");
  };

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 200);
  }, []);

  return (
    <div className="bg-white flex-1 h-full flex flex-col items-center justify-center p-4 relative overflow-hidden z-10">
      <Image
        height={100}
        width={100}
        src="/innovativets.png"
        alt="Survey"
        className={`img  absolute object-contain top-10 left-10 w-32 lg:w-64 -z-10 ${
          isVisible ? "fade-in-up" : "hidden"
        }`}
      />
      <Image
        height={100}
        width={100}
        src="/thinkingts.png"
        alt="Survey"
        className={`absolute  lg:hidden object-contain bottom-10 right-0 md:right-20 md:bottom-20 w-44 lg:w-64 -z-10 ${
          isVisible ? "fade-in-up" : "hidden"
        }`}
      />
      <Image
        height={100}
        width={100}
        src="/webts.png"
        alt="Survey"
        className={`hidden lg:block lg:absolute object-contain -right-10 -bottom-20 md:right-20 md:bottom-20 w-64 lg:w-64 -z-10 ${
          isVisible ? "fade-in-up" : "hidden"
        }`}
      />
      <div className="absolute top-0 left-0 h-full w-full">
        <span className="h-96 drop-shadow-lg w-96 rounded-full bg-[#a4d9e3] absolute right-0 -translate-y-1/2 translate-x-1/2 -z-20"></span>
        <span className="h-20 drop-shadow-lg w-20 rounded-full bg-[#a4d9e3] hidden lg:block lg:absolute lg:left-1/4 top-10 translate-y-1/2  -z-20"></span>
        <span className="h-96 drop-shadow-lg w-96 rounded-full bg-[#a4d9e3] absolute bottom-0 right-0 translate-x-1/3 lg:translate-x-1 translate-y-1/2 -z-20"></span>
        <span className="h-96 drop-shadow-lg w-96 rounded-full bg-[#4e8d99] opacity-10 absolute top-2/3 md:top-1/2 -translate-y-1/2 right-1/2 -z-20"></span>
      </div>

      <div
        className={`text-center flex flex-col items-center gap-4 relative ${
          isVisible ? "fade-in" : "hidden"
        }`}
      >
        <SiLimesurvey size={50} className="text-[#4e8d99]" />
        <h1 className="text-4xl font-bold mb-4 text-[#4e8d99]">{heading}</h1>
        <p className="text-lg mb-6 text-gray-700">{description}</p>
        <button
          className="border-[#4e8d99] border-2 text-[#4e8d99] flex items-center px-6 py-2 rounded-full hover:bg-[#4e8d99] hover:text-gray-50 transition duration-300 scale-100"
          onClick={handleStartNow}
        >
          <span className="font-semibold">START NOW</span>
          <FaArrowRight className="ml-4" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
