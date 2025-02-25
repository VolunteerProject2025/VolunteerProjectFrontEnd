import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
// Base API URL
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export function useAuth(loginType) {
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const endpoint = loginType === "google" ? "/google" : "/login";
            const response = await axios.post(`${API_URL}${endpoint}`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
     
        
            Swal.fire({
                title: "Success!",
                text: "Login successful! Redirecting...",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continue",
                backdrop: "rgba(0,0,0,0.7)",
            });
            const user = response.data.user
            if(!user.role){
                navigate("/role");
                return; 
            }
            navigate("/"); // Redirect to home after login
        } catch (error) {
            console.error(`${loginType} Login Error:`, error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Login failed!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return loginType === "google"
        ? useGoogleLogin({
            onSuccess: (response) => {
                handleLogin({ code: response.code }); // Send token to backend
            },
            onError: (error) => console.error("Login Failed:", error),
            flow: "auth-code",
        })
        : handleLogin;
}

// 🔹 Logout Function
export function useLogout() {
    
    const handleLogOut = async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, {    
                   headers: { "Content-Type": "application/json" },
            withCredentials: true }); // ✅ Sends request to clear token
      
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return handleLogOut;
}

// 🔹 Registration Hook
export function useRegister() {
    const handleRegister = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

         

            Swal.fire({
                title: "Success!",
                text: "Registration successful! Check your email.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continue",
                backdrop: "rgba(0,0,0,0.7)",
            });
        } catch (error) {
            console.error("Registration Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Registration failed!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return handleRegister;
}

// 🔹 Email Verification Hook
export function useVerifyEmail() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying email...");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setMessage("Invalid verification link.");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/verify_email?token=${token}`);
                setMessage(response.data.message || "Email verified successfully! Redirecting to login...");
                setTimeout(() => navigate("/"), 3000);
            } catch (error) {
                console.error("Verification Error:", error);
                setMessage(error.response?.data?.message || "Error verifying email.");
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return message;
}

export function useChooseRole() {
    const navigate = useNavigate();
    const handleChooseRole = async (roleData) => {
        try {
            const response = await axios.post(`${API_URL}/role`, roleData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

         

            Swal.fire({
                title: "Success!",
                text: "Role successfully Change!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continue",
                backdrop: "rgba(0,0,0,0.7)",
            });
            navigate("/"); 
        } catch (error) {
            console.error("Registration Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Registration failed!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    }
    return handleChooseRole
}