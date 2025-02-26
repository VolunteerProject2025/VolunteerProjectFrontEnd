import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import { useEffect, useContext, useState } from "react";
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;


export function userProfile() {
    const { user } = useContext(AuthContext); // Access the user from AuthContext

    return {
        fullName: user?.fullName || '',
        email: user?.email || '',
        img_profile: user?.img_profile ,
    };
}

export function organizationProfile() {
    
}