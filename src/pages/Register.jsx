import { useRegister } from '../hooks/authHook';
import { useState } from 'react';
import { useAuth } from '../hooks/authHook';
import { Link } from "react-router-dom";
import '../assets/css/login.css';

export function Register() {
    const registerUser = useRegister(); // Custom hook for registration
    const googleLogin = useAuth('google'); // Google login

    const [userData, setUserData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(userData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            alert('Passwords do not match.');
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
                                    </div>
                                    
                                    <div className="col-12 text-center">
                                        <button className="form__submit" type="submit">Sign Up</button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <strong><Link className="form__link" to="/login">Sign in</Link> if you have an account</strong>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button onClick={googleLogin} className="btn-google">
                                            <i className="fab fa-google"></i> Sign Up with Google
                                        </button>
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
