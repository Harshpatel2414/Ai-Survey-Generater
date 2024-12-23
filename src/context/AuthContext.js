'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "./AppContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSurvey } = useAppContext();

  useEffect(() => {
    refreshUser();
  }, []);


  const refreshUser = async () => {
    try {
      const response = await fetch(`/api/me`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true); 
    setCurrentUser(null);
    setSurvey("");
    await fetch("/api/logout");
    setLoading(false); 
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handleLogout,
        loading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};