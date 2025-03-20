import { useRegister } from '../hooks/authHook';
import { useEffect, useContext, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
export function Register() {
    const navigate = useNavigate();

    const registerUser = useRegister(); // Custom hook for registration
    const { login } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };
    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                // Handle Google login with role
                if (!userData.role) {
                    Swal.fire({
                        title: "Error!",
                        text: "Please select a role before logging in",
                        icon: "error"
                    });
                    return;
                }

                const responseGoogle = await axios.post(`${API_URL}/google`, {
                    code: response.code,
                    role: userData.role
                }, {
                    withCredentials: true,
                });

                Swal.fire({
                    title: "Success!",
                    text: "Login successful! Redirecting...",
                    icon: "success",
                });
                const organization = responseGoogle.data.organization
                const user = responseGoogle.data.user;
                login(user);
                if (user.role === "Admin") return navigate("/admin");
                if (user.role === "Organization" && organization === null) return navigate('/create-organization');
                navigate("/");
            } catch (error) {
                console.error("Google Login Error:", error);
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.error || "Login failed!",
                    icon: "error",
                });
            }
        },
        onError: (error) => {
            console.error("Google Login Failed:", error);
            Swal.fire({
                title: "Error!",
                text: "Google login failed",
                icon: "error",
            });
        },
        flow: "auth-code",
    });
    const handleGoogleLogin = () => {
        if (!userData.role) {
            Swal.fire({
                title: "Error!",
                text: "Please select a role before logging in with Google",
                icon: "error",
            });
            return;
        }
        // This initiates the Google login flow
        googleLogin();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(userData.email)) {
            Swal.fire({
                title: "Error!",
                text: "Please enter a valid email address.",
                icon: "error",
            });
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            Swal.fire({
                title: "Error!",
                text: "Passwords do not match.",
                icon: "error",
            });
            return;
        }

        if (!userData.role) {
            Swal.fire({
                title: "Error!",
                text: "Please select a role.",
                icon: "error",
            });
            return;
        }

        try {
            await registerUser(userData);
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    return (
        <section className="section ">
            <div className="container">
                <div className="row offset-margin">
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom"></div>
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                        <form className="form account-form sign-up-form" onSubmit={handleSubmit}>
                            <div className="form__fieldset">
                                <h6 className="form__title">Sign Up</h6>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            className="form__field"
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={userData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={userData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={userData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />

                                        {/* Role Selection */}
                                        <div className=" role-selection">
                                            <div className="role-title">Select your role:</div>
                                            <div className="role-options">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="role"
                                                        id="volunteer"
                                                        value="Volunteer"
                                                        checked={userData.role === "Volunteer"}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="volunteer">
                                                        Volunteer
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="role"
                                                        id="organization"
                                                        value="Organization"
                                                        checked={userData.role === "Organization"}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="organization">
                                                        Organization
                                                    </label>
                                                </div>
                                                                                      
                                                                                      </div>
                                        </div>
                                    </div>

                                    <div className="col-12 text-center">
                                        <button className="form__submit" type="submit">Sign Up</button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <strong><Link className="form__link" to="/login">Sign in</Link> if you have an account</strong>
                                    </div>
                                    
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom"></div>
                </div>
            </div>
        </section>
    );
}