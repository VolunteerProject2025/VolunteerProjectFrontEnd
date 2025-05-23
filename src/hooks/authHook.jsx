import { useGoogleLogin } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from '../context/AuthContext'; 
// Base API URL
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// 🔹 Authentication Hook (Login)
// In your authHook.jsx
export function useAuth(loginType) {
    const { login } = useContext(AuthContext); // Access the login function from context
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const endpoint = loginType === "google" ? "/google" : "/login";
            const response = await axios.post(`${API_URL}${endpoint}`, data, {
                withCredentials: true, // ✅ Ensures JWT is stored in cookies
            });

            Swal.fire({
                title: "Success!",
                text: "Login successful! Redirecting...",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continue",
                backdrop: "rgba(0,0,0,0.7)",
            });

            const user = response.data.user;
            
            login(user); // Update global auth state
             // Get user data from login response
             const organization = response.data.organization;
             console.log('User:', user);
             console.log('Organization:', organization);
            if(user.role=='Guest'){
                navigate("/role");
                return;
            }
            if(user.role=='Organization' && organization===null){
                navigate("/create-organization");
                return;
            }
            if(user.role=='Admin'){
                navigate('/admin')
                return
            }
           

            navigate("/");
        } catch (error) {
            console.error(`${loginType} Login Error:`, error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.error || "Login failed!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return loginType === "google"
        ? useGoogleLogin({
            onSuccess: (response) => handleLogin({ code: response.code }), // ✅ Send Google auth code
            onError: (error) => console.error("Login Failed:", error),
            flow: "auth-code",
        })
        : handleLogin;
}



// 🔹 Logout Hook
export function useLogout() {
    const { logout } = useContext(AuthContext); // Access logout from context
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            logout(); // Clear global state
           
            navigate("/login");
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
            await axios.post(`${API_URL}/register`, userData, {
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
                text: error.response?.data?.error || "Registration failed!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return handleRegister;
}


// 🔹 Choose Role Hook
export function useChooseRole() {
    const navigate = useNavigate();

    const handleChooseRole = async (roleData) => {
        try {
          const response = await axios.post(`${API_URL}/role`, roleData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl; // Redirect for Organization role
                return;
            }
            Swal.fire({
                title: "Success!",
                text: "Role successfully changed!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continue",
                backdrop: "rgba(0,0,0,0.7)",
            });

            // ✅ Fetch updated user info after role change
            const userResponse = await axios.get(`${API_URL}/me`, { withCredentials: true });
            const user = userResponse.data.user;

            if (user.role) {
                navigate("/");
            } else {
                navigate("/role");
            }
        } catch (error) {
            console.error("Choose Role Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to update role!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return handleChooseRole;
}
export function useChangePassword() {
    const handleChangePassword = async (oldPassword, newPassword,confirmPassword) => {
        try {
            const response = await axios.post(
                `${API_URL}/change-password`, 
                { oldPassword, newPassword,confirmPassword }, 
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true, // ✅ Sends cookies with request
                }
            );

            Swal.fire({
                title: "Success!",
                text: response.data.message || "Password changed successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });

        } catch (error) {
            console.error("Change Password Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.error || "Failed to change password!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return handleChangePassword;
}
export function useForgotPassword() {
    const handleForgotPassword = async (email) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });

            Swal.fire({
                title: "Success!",
                text: response.data.message || "Password reset link sent to your email!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Forgot Password Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to send reset link!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return handleForgotPassword;
}

// 🔹 Reset Password Hook
export function useResetPassword() {
    const navigate = useNavigate();

    const handleResetPassword = async (token, newPassword, confirmPassword) => {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword,confirmPassword });

            Swal.fire({
                title: "Success!",
                text: response.data.message || "Password reset successful! You can now log in.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });

            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Reset Password Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.error || "Failed to reset password!",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return handleResetPassword;
}
