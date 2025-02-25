import { useRegister } from '../hooks/useAuth';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../assets/login/css/bootstrap.min.css';
import '../assets/login/css/fontawesome-all.min.css';
import '../assets/login/css/iofrm-style.css';
import '../assets/login/css/iofrm-theme43.css';
import { Link } from "react-router-dom";
export function Register() {
    const registerUser = useRegister(); // Custom hook for registration
    const googleLogin = useAuth('google'); // Google login
    
    const [userData, setUserData] = useState({ fullName: '',  email: '', password: '' });

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
                            <h3 className="font-md">Join us and explore more features.</h3>
                            <p>Sign up to get access to the best design and web tools.</p>
                            <form onSubmit={handleSubmit}>
                            <input 
                                    className="form-control" 
                                    type="fullName" 
                                    name="fullName" 
                                    placeholder="Full Name" 
                                    value={userData.fullName} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <input 
                                    className="form-control" 
                                    type="email" 
                                    name="email" 
                                    placeholder="E-mail Address" 
                                    value={userData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <input 
                                    className="form-control" 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password" 
                                    value={userData.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <div className="form-button d-flex">
                                    <button type="submit" className="btn btn-primary">Register</button>
                                    <Link to="/" className="btn btn-outline-primary">Already have an account? Login</Link>
                               
                                </div>
                            </form>
                           
                            <div className="other-links">
                                <span>Or register with</span>
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
