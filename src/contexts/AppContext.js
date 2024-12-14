"use client"
import getModelResponse from '@/utils/getModelResponse';
import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);


export const AppContextProvider = ({ children }) => {
    const [survey, setSurvey] = useState("");
    const [ loading, setLoading ] = useState(false);
     
    const fetchSurveyResponse = async (prompt) => {
        try {
          setSurvey(""); // Clear previous response
          setLoading(true);
    
          await getModelResponse(prompt, (chunk) => {
            setSurvey((prev) => prev + chunk); // Append chunks to state
          });
        } catch (error) {
          console.error("Error fetching survey response:", error);
        } finally {
          setLoading(false);
        }
      };

    return (
        <AppContext.Provider value={{ survey, setSurvey, loading, setLoading,fetchSurveyResponse  }}>
            {children}
        </AppContext.Provider>
    );
};