import { useState } from "react";
import { useSearchParams } from "react-router-dom"; // Add this import
import { useResetPassword } from "../hooks/authHook";
import '../assets/css/login.css';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const handleResetPassword = useResetPassword();
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleResetPassword(token, newPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="welcome-text">Reset Password</h1>

                <form onSubmit={handleSubmit}>
                    <div className="field-box">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}