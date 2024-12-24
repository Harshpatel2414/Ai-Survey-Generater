"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./common/Button";
import { useAppContext } from "@/context/AppContext";
import fetchSurveyPrompt from "@/helpers/fetchSurveyPrompt";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SurveyForm() {
  // Use state to force re-renders when the form values change
  const [surveyQuestions, setSurveyQuestions] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [individuals, setIndividuals] = useState("");

  const {
    loading,
    setLoading,
    fetchSurveyResponse,
    isProcessPayment,
    setIsProcessPayment,
    formdata,
    setFormData,
  } = useAppContext();
  const { currentUser, refreshUser } = useAuth();
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [amountNeeded, setAmountNeeded] = useState(0);
  const buttonRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("formData");
    if (data) {
      const { surveyQuestions, characteristics, individuals } =
        JSON.parse(data);
      setSurveyQuestions(surveyQuestions);
      setCharacteristics(characteristics);
      setIndividuals(individuals);
    }
  }, []);

  // Automatically generate survey if needed
  useEffect(() => {
    if (surveyQuestions && characteristics && individuals && isProcessPayment) {
      setIsProcessPayment(false);
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  }, [surveyQuestions, characteristics, individuals, isProcessPayment]);

  // Handle form input changes and store values in refs and state
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "surveyQuestions") {
      setSurveyQuestions(value);
    } else if (name === "characteristics") {
      setCharacteristics(value);
    } else if (name === "individuals") {
      setIndividuals(value);
    }
  };

  const handleGenerateSurvey = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    setFormData({ surveyQuestions, characteristics, individuals });
    localStorage.setItem(
      "formData",
      JSON.stringify({ surveyQuestions, characteristics, individuals })
    );
    if (!surveyQuestions || !characteristics || !individuals) {
      setFormError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    if (!currentUser) {
      toast(
        (t) => (
          <div>
            <p className="mb-2">
              Please log in or register to continue to Generate Survey
            </p>
            <div className="flex gap-2 items-center justify-center">
              <button
                className="py-1 px-4 bg-white border rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push("/login");
                }}
              >
                Login
              </button>
              <button
                className="py-1 px-4 bg-[#4e8d99] text-white rounded-md hover:bg-[#5da2a5]"
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push("/register");
                }}
              >
                Register
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
      setLoading(false);
      return;
    }

    const cost = calculateCost(individuals);
    const amountNeeded = Math.max(0, cost - currentUser.walletAmount);

    if (currentUser.walletAmount < cost) {
      setAmountNeeded(amountNeeded.toFixed(2));
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      await fetchSurveyResponse(
        fetchSurveyPrompt(surveyQuestions, characteristics, individuals)
      );
      setSurveyQuestions("");
      setCharacteristics("");
      setIndividuals("");
      setFormData({
        surveyQuestions: "",
        characteristics: "",
        individuals: "",
      })
      localStorage.removeItem("formData");

      const response = await fetch("/api/wallet/deduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: cost, userId: currentUser._id }),
      });
      if (!response.ok) {
        setFormError("Failed to deduct amount from wallet.");
        return;
      }
      await refreshUser();
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = (numberOfProfiles) => {
    const cost = 5 + numberOfProfiles * 0.1;
    return parseFloat(cost.toFixed(2));
  };

  return (
    <div className="mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">AI Survey Form</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Survey Questions
          </label>
          <textarea
            name="surveyQuestions"
            value={surveyQuestions}
            onChange={handleChange}
            placeholder="Enter your survey questions, separated by new lines."
            className="w-full p-2 border rounded-md resize-none outline-none"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Survey Group Characteristics
          </label>
          <input
            type="text"
            name="characteristics"
            value={characteristics}
            onChange={handleChange}
            placeholder="e.g. 'Teenagers interested in gaming'"
            className="w-full p-2 border rounded-md outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Individuals
          </label>
          <input
            type="number"
            name="individuals"
            value={individuals}
            onChange={handleChange}
            placeholder="Enter the number of individuals (default: 10)"
            min="1"
            className="w-full p-2 border rounded-md outline-none"
          />
        </div>

        {formError && <p className="text-red-500">{formError}</p>}
        <Button
          ref={buttonRef}
          onClick={(e) => handleGenerateSurvey(e)}
          disabled={loading}
          text={`Generate Survey $${calculateCost(individuals)}`}
          className="w-full bg-[#4e8d99] hover:bg-[#589eac]"
        />
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center w-96 flex flex-col gap-4 items-center">
            <Image src={"/wallet.png"} alt="wallet" width={200} height={200} />
            <p className="mb-4">
              Insufficient funds. Please add <b>${amountNeeded}</b> to your
              wallet.
            </p>
            <div className="flex w-full gap-4">
              <Link
                href={`/profile`}
                onClick={() => setShowModal(false)}
                className="py-2 w-full px-4 bg-[#4e8d99] text-white rounded-md hover:bg-[#589eac]"
              >
                Add Money
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
