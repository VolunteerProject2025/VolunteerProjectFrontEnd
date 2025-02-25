import { useAuth } from '../hooks/useAuthHook';
import { useState } from 'react';
import '../assets/css/login.css';
import { Link } from "react-router-dom";

export function Login() {
    const googleLogin = useAuth('google'); // Google login
    const normalLogin = useAuth('normal'); // Normal login function

    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await normalLogin(credentials); // Calls normal login function
        } catch (error) {
            console.error('Login Error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="welcome-text">Welcome Back</h1>
                <p className="subtitle">Log in to continue</p>

                <form onSubmit={handleSubmit}>
                    <div className="field-box">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
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
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <p className="register-link">
                        Not a member yet?  
                        <Link to="/register" className="btn-register">Create account</Link>
                    </p>

                    <button type="submit" className="login-btn">Log In</button>

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
