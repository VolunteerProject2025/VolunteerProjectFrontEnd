import axios from "axios";
import { AuthContext } from '../context/AuthContext';
const API_URL = `${import.meta.env.VITE_API_URL}/org`;


export function userProfile() {
    const { user } = useContext(AuthContext); // Access the user from AuthContext

    return {
        fullName: user?.fullName || '',
        email: user?.email || '',
        img_profile: user?.img_profile ,
    };
}

export function organizationProfile() {
    const handleOrgDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/org-details`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching organization details:', error);
            throw error;
        }
    };

    return { handleOrgDetail }; // Return the function so it can be used elsewhere
}