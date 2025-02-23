import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
// Base API URL
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// 🔹 Login Hook (Supports Google & Email Login)
export function useAuth(loginType) {
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const endpoint = loginType === "google" ? "/google" : "/login";
            const response = await axios.post(`${API_URL}${endpoint}`, data, {
                headers: { "Content-Type": "application/json" },
            });
     
            const userData = response.data.user;
          
            if (userData._id && userData.email) {
                Cookies.set("userId", userData._id, { expires: 1, secure: true });
                Cookies.set("email", userData.email, { expires: 1, secure: true });
            }

            Swal.fire({
                title: "Success!",
                text: "Login successful! Redirecting...",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continue",
                backdrop: "rgba(0,0,0,0.7)",
            });

            navigate("/home"); // Redirect to home after login
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
                console.log("Access Token:", response.access_token);
                handleLogin({ token: response.access_token }); // Send token to backend
            },
            onError: (error) => console.error("Login Failed:", error),
            flow: "implicit",
        })
        : handleLogin;
}

// 🔹 Logout Function
export function useLogout() {
    const navigate = useNavigate();
    const handleLogOut = () => {
        try {
            Cookies.remove("userId");
            Cookies.remove("email");
            navigate("/"); // Redirect to login page
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
            });

            const data = response.data.user;
            if (data._id && data.email) {
                  // Store user data in cookies (expires in 1 day)
                  Cookies.set("userId", data._id, { expires: 1, secure: true });
                  Cookies.set("email", data.email, { expires: 1, secure: true });
            }

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
