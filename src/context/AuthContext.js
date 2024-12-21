'use client';

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      setLoading(false);
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser && !loading) { 
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser, loading]);

  const refreshUser = async () => {
    try {
      const response = await fetch(`/api/user`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("Error refreshing user:", error);
    } 
  }

  const handleLogout = () => {
    setLoading(true); 
    setCurrentUser(null);
    localStorage.clear();
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