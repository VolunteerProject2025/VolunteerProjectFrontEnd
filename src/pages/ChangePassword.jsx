import { useChangePassword } from '../hooks/authHook';
import { useState } from 'react';
import { Link } from "react-router-dom";

export function ChangePassword() {
    const changePassword = useChangePassword();
    const [credentials, setCredentials] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(credentials.oldPassword, credentials.newPassword, credentials.confirmPassword);
        } catch (error) {
            console.error('Password Change Error:', error);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <div className="row offset-margin">
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                    </div>
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                        <form className="form account-form" onSubmit={handleSubmit}>
                            <div className="form__fieldset">
                                <h6 className="form__title">Change Password</h6>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="oldPassword"
                                            placeholder="Current Password"
                                            value={credentials.oldPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="newPassword"
                                            placeholder="New Password"
                                            value={credentials.newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm New Password"
                                            value={credentials.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 text-center">
                                        <button className="form__submit" type="submit">Change Password</button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <Link className="form__link" to="/profile">Back to Profile</Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                    </div>
                </div>
            </div>
        </section>
    );
}
