import { AuthContext } from '../context/AuthContext';
import { useContext } from "react";

export function userProfile() {
    const { user } = useContext(AuthContext); // Access the user from AuthContext

    return {
        fullName: user?.fullName || '',
        email: user?.email || '',
        img_profile: user?.img_profile ,
    };
}

export function organizationProfile() {
   const { organization } = useContext(AuthContext); // Access the organization from Auth

    return { organization }; // Return the function so it can be used elsewhere
}