"use client";
import { memo } from "react";
import Button from "./common/Button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppContext } from "@/contexts/AppContext";

const SurveyResultsv = () => {
  const { survey, setSurvey } = useAppContext();

  const handleReset = () => {
    setSurvey("");
  };

  return (
    <section className="bg-white  flex-1 m-5 p-6 rounded-md shadow-md sticky top-24">
      <div className="border-b-2 border-gray-200 ">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Survey Results</h2>
      </div>
      <div className="h-[65dvh] p-4">
        <div className="h-full text-gray-500 overflow-hidden overflow-y-scroll hide-scrollbar markdown-container">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{survey}</ReactMarkdown>
        </div>
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
