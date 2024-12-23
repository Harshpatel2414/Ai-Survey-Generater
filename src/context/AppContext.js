"use client"
import getModelResponse from '@/utils/getModelResponse';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);


export const AppContextProvider = ({ children }) => {
  const [survey, setSurvey] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessPayment, setIsProcessPayment] = useState(false);
  const [formdata,setFormData] = useState({
    surveyQuestions: "",
    characteristics: "",
    individuals: ""
  });
  
  useEffect(() => {
    const data = localStorage.getItem("formData");
    if(data){
      setFormData(JSON.parse(data));
    }
  },[])
  

  const fetchSurveyResponse = async (prompt) => {
    try {
      setSurvey("");
      await getModelResponse(prompt, (chunk) => {
        setSurvey((prev) => prev + chunk); // Append chunks to state
      });
    } catch (error) {
      console.error("Error fetching survey response:", error);
    }
  };

  return (
    <AppContext.Provider value={{
      survey,
      setSurvey,
      loading,
      setLoading,
      fetchSurveyResponse,
      isProcessPayment,
      setIsProcessPayment,
      formdata,setFormData
    }}>
      {children}
    </AppContext.Provider>
  );
};