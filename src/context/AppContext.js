"use client"
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
  

  return (
    <AppContext.Provider value={{
      survey,
      setSurvey,
      loading,
      setLoading,
      isProcessPayment,
      setIsProcessPayment,
      formdata,setFormData
    }}>
      {children}
    </AppContext.Provider>
  );
};