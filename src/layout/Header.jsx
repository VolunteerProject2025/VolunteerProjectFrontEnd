import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import '../assets/css/header.css';
import logo from '../assets/img/volunteer_act_logo.png';
import imgProfile from '../assets/img/user_img.png'
const Header = () => {
    const navigate = useNavigate();

    const { user, logout, loading } = useContext(AuthContext); // Access auth context

    if (loading) {
        return <div>Loading...</div>; // You can show a loading spinner while fetching the user
    }
    const handleProfileClick = async () => {
        // Navigate to Profile page
        navigate('/profile');
        // You can fetch user details here if needed
    };

    return (
        <header>
            <section className="img-logo">
                <Link to="/" className="btn btn-outline-primary">
                    <img src={logo} alt="logo-img" />
                </Link>
            </section>

            <section className="search-bar-section">
                <input className="search-bar" type="search" placeholder="Search..." />
            </section>

            <ul className="last-links">
                {user ? (
                    <>
                        <li className="user-greeting">
                            Welcome, {user.fullName}!
                            <li>
                                <Link to={user.role === "Organization" ? "/organization-profile" : "/profile"}>
                                    <img src={user.img_profile || imgProfile} alt="User Profile" />
                                </Link>
                            </li>

                        </li>
                        <li>
                            <Link onClick={logout} className="btn btn-danger">
                                Log Out
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" className="btn btn-outline-primary">Log In</Link></li>
                        <li><Link to="/register" className="btn btn-outline-primary">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </header>
    );
};

export default Header;
