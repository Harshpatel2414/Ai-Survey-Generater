"use client";
import { useState } from "react";
import Button from "./common/Button";
import { useAppContext } from "@/contexts/AppContext";

export default function SurveyForm() {
  const [surveyQuestions, setSurveyQuestions] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [individuals, setIndividuals] = useState("");
  const { setSurvey, setLoading } = useAppContext();

  // Handle form submission
  const handleGenerateSurvey = async () => {
    setLoading(true);
  
    try {      
      let response = await fetch("api/survey", {
        method: "POST",
        body: JSON.stringify({
          surveyQuestions,
          characteristics,
          individuals,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      let data = await response.json();

      if (response.ok) {
        setSurvey(data);
        setCharacteristics("");
        setSurveyQuestions("");
        setIndividuals("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">AI Survey Form</h1>
      <form className="space-y-4">
        {/* Survey Questions */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Survey Questions
          </label>
          <textarea
            name="surveyQuestions"
            value={surveyQuestions}
            onChange={(e) => setSurveyQuestions(e.target.value)}
            placeholder="Enter your survey questions, separated by new lines."
            className="w-full p-2 border rounded-md resize-none outline-none"
            rows="4"
          />
        </div>

        {/* Survey Group Characteristics */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Survey Group Characteristics
          </label>
          <input
            type="text"
            name="groupCharacteristics"
            value={characteristics}
            onChange={(e) => setCharacteristics(e.target.value)}
            placeholder="e.g. 'Teenagers interested in gaming'"
            className="w-full p-2 border rounded-md outline-none"
          />
        </div>

        {/* Number of Individuals */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Individuals
          </label>
          <input
            type="number"
            name="numberOfIndividuals"
            value={individuals}
            onChange={(e) => setIndividuals(e.target.value)}
            placeholder="Enter the number of individuals (default: 10)"
            min="1"
            className="w-full p-2 border rounded-md outline-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleGenerateSurvey}
          disabled={!surveyQuestions }
          text="Generate Survey"
          className="w-full bg-[#4e8d99] hover:bg-[#589eac]"
        />
      </form>
    </div>
  );
}
