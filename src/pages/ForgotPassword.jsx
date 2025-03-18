import { useForgotPassword } from "../hooks/authHook";
import { useState } from "react";
import { Link } from "react-router-dom";

export function ForgotPassword() {
    const handleForgotPassword = useForgotPassword();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleForgotPassword(email);
        } catch (error) {
            console.error("Forgot Password Error:", error);
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
                                <h6 className="form__title">Forgot Password</h6>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            className="form__field"
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 text-center">
                                        <button className="form__submit" type="submit">Send Reset Link</button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <Link className="form__link" to="/login">Back to Login</Link>
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
