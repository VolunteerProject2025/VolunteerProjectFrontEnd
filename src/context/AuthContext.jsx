import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
const ORG_API_URL = `${import.meta.env.VITE_API_URL}/organizations`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [organization, setOrganization] = useState(null);
    // Create a memoized fetchUser function with useCallback
    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create a memoized fetchOrganization function
    const fetchOrganization = useCallback(async () => {
        try {
            const response = await axios.get(`${ORG_API_URL}/org-details`, { withCredentials: true });
            setOrganization(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching organization details:", error);
            return null;
        }
    }, []);
  
    // Force a refresh of the data
    const refreshData = useCallback(async () => {
        const userData = await fetchUser();
        if (userData?.role === "Organization") {
            await fetchOrganization();
        }
    }, [fetchUser, fetchOrganization]);

    // Initial data load
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Load organization data when user changes
    useEffect(() => {
        if (user?.role === "Organization") {
            fetchOrganization();
        }
    }, [user, fetchOrganization]);

    const login = async (userData) => {
        setUser(userData);
        if (userData.role === "Organization") {
            await fetchOrganization();
            
        }
    };

    const logout = async () => {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        setUser(null);
        setOrganization(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            organization, 
            login, 
            logout, 
            refreshData, 
            // lastUpdate,
           
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hooks
// export function useUserProfile() {
//     const { user, lastUpdated } = useContext(AuthContext);
//     const [profileData, setProfileData] = useState({
//         fullName: '',
//         email: '',
//         img_profile: null
//     });
    
//     // Update profile data whenever user or lastUpdated changes
//     useEffect(() => {
//         if (user) {
//             setProfileData({
//                 fullName: user.fullName || '',
//                 email: user.email || '',
//                 img_profile: user.img_profile
//             });
//         }
//     }, [user, lastUpdated]);
    
//     return profileData;
// }

// export function useOrganizationProfile() {
//     const { organization, refreshData } = useContext(AuthContext);
    
//     // Return the organization directly from context along with the refresh function
//     return {
//         organization,
//         refreshOrgData: refreshData
//     };
// }