'use client';

import { createContext, use, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminContextProvider = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            setLoading(true);
            const response = await fetch("/api/me");
            const data = await response.json();
            setCurrentAdmin(data);
            setLoading(false);
        };

        fetchAdmin();
    }, []);

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