import React, { useState, useEffect } from "react";
import { useLogout } from "../hooks/useAuth";
import '../assets/css/header.css';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import logo from '../assets/img/volunteer_act_logo.png';
import { userDataService } from "../hooks/userDataService"; // Import the object with named exports

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState(""); // Add state for user role
    const logout = useLogout(); // Get the logout function from the hook

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get("token");
            if (token) {
                setIsAuthenticated(true);
                
                // Use the fetchUserData method from the imported service
                const userData = await userDataService.fetchUserData();
                if (userData) {
                    setUserName(userData.fullName || userData.name || "User");
                    setUserRole(userData.role || ""); // Store the user role
                }
            } else {
                setIsAuthenticated(false);
                setUserName("");
                setUserRole("");
            }
        };
        
        checkAuth();
    }, []);

    // Keep the original logout handling
    const handleLogOut = async () => {
        await logout();
        setIsAuthenticated(false);
        setUserName("");
        setUserRole("");
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
                {isAuthenticated ? (
                    <>
                        <li className="user-greeting">
                            Welcome, {userName}!
                            {userRole && <span className="user-role">({userRole})</span>}
                        </li>
                        <li>
                            <button onClick={handleLogOut} className="btn btn-danger">Log Out</button>
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