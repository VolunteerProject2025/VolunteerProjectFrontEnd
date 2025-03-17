import { AuthContext } from '../context/AuthContext';
import { useContext, useState, useEffect } from "react";
const API_URL = `${import.meta.env.VITE_API_URL}/volunteers`;

export function useProfile() {
    const { user } = useContext(AuthContext);
    const [volunteerData, setVolunteerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user._id) {
            setLoading(false);
            return;
        }

        const fetchVolunteerProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/me`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to fetch volunteer profile: ${response.status}`);
                }

                const data = await response.json();

                // ✅ Gán dữ liệu từ API vào state
                setVolunteerData({
                    fullName: data.fullName || user?.fullName || '',
                    email: data.email || user?.email || '',
                    phone: data.phone || '',
                    dateOfBirth: data.dateOfBirth || '',
                    gender: data.gender || '',
                    skills: data.skills || [],
                    interest: data.interest || [],
                    availableDays: data.availableDays || [],
                    availableHours: data.availableHours || [],
                    location: data.location || '',
                    willingToTravel: data.willingToTravel || false,
                    bio: data.bio || '',
                    img_profile: user?.img_profile || data.img_profile || null,
                });

            } catch (err) {
                console.error("❌ Error fetching volunteer profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteerProfile();
    }, [user]);

    return {
        isAuthenticated: !!user,
        isLoading: loading,
        error,
        userProfile: volunteerData,
    };
}

export async function updateProfile(updatedData) {
    try {
        const response = await fetch(`${API_URL}/me`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update profile");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        throw error;
    }
}

export function organizationProfile() {
    const { organization, lastUpdated, refreshData } = useContext(AuthContext);
    const [orgData, setOrgData] = useState({ organization });
    
    // Update organization data when organization or lastUpdated changes
    useEffect(() => {
        setOrgData({ organization });
    }, [organization, lastUpdated]);    
    
    // Return both the data and the refresh function
    return {
        ...orgData,
        refreshOrgData: refreshData
    };
}