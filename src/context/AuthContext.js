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
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};