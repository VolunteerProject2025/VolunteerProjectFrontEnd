import { useAuth } from '../hooks/authHook';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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
        
        <section className="section ">
            <div className="container">
                <div className="row offset-margin ">
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                    </div>
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                        <form className="form account-form sign-in-form" onSubmit={handleSubmit}>
                            <div className="form__fieldset">
                                <h6 className="form__title">Sign In</h6>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            className="form__field"
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 d-flex align-items-end justify-content-between flex-wrap">
                                        <label className="form__checkbox-label">
                                            <input
                                                className="form__input-checkbox"
                                                type="checkbox"
                                                name="remember"
                                            />
                                            <span className="form__checkbox-mask"></span>
                                        </label>
                                        <Link className="form__link" to="/forgot-password">I forgot my password</Link>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button className="form__submit" type="submit">Sign In</button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <strong>
                                            <Link className="form__link" to="/register">Sign up</Link> if you don’t have an account
                                        </strong>
                                    </div>
                                    <div className="col-12 text-center">
                                        <span>Or login with</span>
                                        
                                    </div>
                                    <div className="col-12 text-center">
                                        <button onClick={googleLogin} className="btn-google" type="button" style={{
                                            borderRadius: '50px',
                                            padding: '10px 20px',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #dadce0',
                                            color: '#3c4043',
                                            fontWeight: '500'
                                        }}>
                                            <FcGoogle size={24} style={{ marginRight: '8px' }} /> Google
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                    </div>
                </div>
            </div></section>

    );
}
