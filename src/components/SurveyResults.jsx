"use client";
import { memo, useEffect, useRef, useState } from "react";
import Button from "./common/Button";
import TypingEffect from "./TypingEffect";
import { useAppContext } from "@/contexts/AppContext";

const SurveyResultsv = () => {
  const { loading, survey, setSurvey } = useAppContext();

  const handleReset = () => {
    setSurvey("");
  };

  return (
    <section className="bg-white  flex-1 m-5 p-6 rounded-md shadow-md sticky top-24">
      <div className="border-b-2 border-gray-200 ">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Survey Results</h2>
      </div>
      <div className="h-96">
        {loading ? (
          <div className="flex items-center justify-start py-1 h-10 gap-1 pl-2">
            <div className="dot bounce-animation text-3xl text-[#6d445e] font-bold">
              .
            </div>
            <div
              className="dot bounce-animation text-3xl text-[#6d445e] font-bold"
              style={{ animationDelay: "0.2s" }}
            >
              .
            </div>
            <div
              className="dot bounce-animation text-3xl text-[#6d445e] font-bold"
              style={{ animationDelay: "0.4s" }}
            >
              .
            </div>
          </div>
        ) : (
          <div className="min-h-96 max-h-96 text-gray-500 p-4 overflow-y-scroll ">
            <TypingEffect content={survey} />
          </div>
        )}
      </div>
      <Button
        onClick={handleReset}
        text="Reset Survey"
        className="w-full bg-[#4e8d99] hover:bg-[#589eac]"
      />
    </section>
  );
};

export default memo(SurveyResultsv);
