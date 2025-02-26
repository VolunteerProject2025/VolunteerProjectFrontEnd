import { useChangePassword } from "../hooks/authHook";
import { useState } from "react";
import '../assets/css/login.css';


export function ChangePassword() {
    const changePassword = useChangePassword();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        changePassword(oldPassword, newPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="welcome-text">Change Password</h1>

                <form onSubmit={handleSubmit}>
                    <div className='field-box'>
                        <label htmlFor="email">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='field-box'>
                        <label htmlFor="email">New Password</label>
                        <input
                            type="password"
                            name="newPassword"

                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>


                    <button type="submit" className="btn login-btn">Change Password</button>
                </form>
            </div>
        </div>

    );
};

