"use client"
import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);


export const AppContextProvider = ({ children }) => {
    const [survey, setSurvey] = useState("");
    const [ loading, setLoading ] = useState(false);

    return (
        <AppContext.Provider value={{ survey, setSurvey, loading, setLoading  }}>
            {children}
        </AppContext.Provider>
    );
};