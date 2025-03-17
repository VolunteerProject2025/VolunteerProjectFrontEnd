import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useResetPassword } from "../hooks/authHook";

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleResetPassword = useResetPassword();
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleResetPassword(token, newPassword, confirmPassword);
    };

    return (
        <section className="section ">
            <div className="container">
                <div className="row offset-margin">
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom"></div>

                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 margin-bottom">
                        <form className="form account-form sign-up-form" onSubmit={handleSubmit}>
                            <div className="form__fieldset">
                                <h6 className="form__title">Reset Password</h6>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <input
                                            className="form__field"
                                            type="password"
                                            name="confirm-password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 text-center">
                                        <button className="form__submit" type="submit">Reset Password</button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <strong><a className="form__link" href="/login">Sign in</a> if you have an account</strong>
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
