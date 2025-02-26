import { useState } from "react";
import { useForgotPassword } from "../hooks/authHook";
import '../assets/css/login.css';

export function ForgotPassword  (){
    const [email, setEmail] = useState("");
    const handleForgotPassword = useForgotPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleForgotPassword(email);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="welcome-text">Change Password</h1>

                <form onSubmit={handleSubmit}>
                <div className="field-box">
                        <label htmlFor="password">Your Email to Change Password</label>
                        <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        required
                    />
                    </div>
                   
                    <button type="submit" className="login-btn">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
        
    );
};
