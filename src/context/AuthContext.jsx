import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
const ORG_API_URL = `${import.meta.env.VITE_API_URL}/org`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [organization, setOrganization] = useState(null);
    const fetchOrganization = async () => {
        try {
            const response = await axios.get(`${ORG_API_URL}/org-details`, { withCredentials: true });
            setOrganization(response.data);
        } catch (error) {
            console.error("Error fetching organization details:", error);
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
                setUser(response.data.user);
                
                if (response.data.user?.role === "Organization") {
                    await fetchOrganization();
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

      

        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        if (userData.role =="Organization") {
            fetchOrganization();
        }
    };

    const logout = () => {
        setUser(null);
        setOrganization(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, organization, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
