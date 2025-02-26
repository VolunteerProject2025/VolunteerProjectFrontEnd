import { useRegister } from '../hooks/authHook';
import { useState } from 'react';
import { useAuth } from '../hooks/authHook';
import '../assets/css/login.css';

import { Link } from "react-router-dom";
export function Register() {
    const registerUser = useRegister(); // Custom hook for registration
    const googleLogin = useAuth('google'); // Google login

    const [userData, setUserData] = useState({ fullName: '', email: '', password: '' });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(userData); // Calls registration function
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    return (
        <div className="login-container">
                <div className="login-box">
                    <h1 className="welcome-text">Register</h1>
                    <p className="subtitle">Register to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className='field-box'>
                        <label htmlFor="email">Full Name</label>
                            <input
                                type="fullName"
                                name="fullName"
                                placeholder="Full Name"
                                value={userData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="field-box">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"

                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-box">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={userData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <p className="register-link">
                            Already have an account?
                            <Link to="/login" className="btn-register"> Login</Link>

                        </p>
                        <button type="submit" className="btn login-btn">Register</button>


                        <div className="other-links">
                            <span>Or login with</span>
                            <button onClick={googleLogin} className="btn-google">
                                <i className="fab fa-google"></i> Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
}
