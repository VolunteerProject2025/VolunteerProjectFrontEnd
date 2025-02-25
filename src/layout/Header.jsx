import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import '../assets/css/header.css';
import logo from '../assets/img/volunteer_act_logo.png';

const Header = () => {
    const { user, logout, loading } = useContext(AuthContext); // Access auth context

    if (loading) {
        return <div>Loading...</div>; // You can show a loading spinner while fetching the user
    }

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
                            Welcome, {user.fullName || user.email}!
                        </li>
                        <li>
                            <button onClick={logout} className="btn btn-danger">Log Out</button>
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
