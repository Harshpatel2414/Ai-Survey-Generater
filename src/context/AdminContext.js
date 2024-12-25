'use client';

import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminContextProvider = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [loading, setLoading] = useState(false);

    const logOut = async () => {
        setLoading(true);
        await fetch("/api/auth/logout");
        setCurrentAdmin(null);
        setLoading(false);
    };

    return (
        <AdminContext.Provider
            value={{
                currentAdmin, setCurrentAdmin, loading, setLoading, logOut
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};