import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import '../assets/login/css/bootstrap.min.css';
import '../assets/login/css/fontawesome-all.min.css';
import '../assets/login/css/iofrm-style.css';
import '../assets/login/css/iofrm-theme43.css';
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
        <div className="form-body form-left">
            <div className="iofrm-layout">
                <div className="img-holder">
                    <div className="bg"></div>
                </div>
                <div className="form-holder">
                    <div className="form-content">
                        <div className="form-items">
                            <div className="website-logo-inside logo-normal">
                                <a href="/">
                                    <div className="logo">
                                        <img className="logo-size" src="images/logo-pink.svg" alt="logo" />
                                    </div>
                                </a>
                            </div>
                            <h3 className="font-md">Get more things done with Login platform.</h3>
                            <p>Access to the most powerful tool in the entire design and web industry.</p>
                            <form onSubmit={handleSubmit}>
                                <input 
                                    className="form-control" 
                                    type="email" 
                                    name="email" 
                                    placeholder="E-mail Address" 
                                    value={credentials.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <input 
                                    className="form-control" 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password" 
                                    value={credentials.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <div className="form-button d-flex">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                    <Link to="/register" className="btn btn-outline-primary">Create account</Link>
                                </div>
                            </form>
                            <div className="other-links">
                                <span>Or login with</span>
                                <button onClick={googleLogin} className="btn btn-google">
                                    <i className="fab fa-google"></i> Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
