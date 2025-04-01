import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { NotificationBell } from "../pages/NotificationBell"; // Import NotificationBell component
import '../assets/css/header.css';
import logo from '../assets/img/volunteer_act_logo.png';
import { organizationProfile } from "../hooks/profileHook";
import { useLogout } from "../hooks/authHook";
const Header2 = () => {
    const organization = organizationProfile();
    console.log(organization.organization);
    const organizationId = organization?.organization?.organization?._id
    const { user, loading } = useContext(AuthContext); // Access auth context
    const handleLogOut = useLogout()
    if (loading) {
        return <div>Loading...</div>; // You can show a loading spinner while fetching the user
    }

    return (
        <>
            <header className="header header--front_2">
                <div>
                    <div style={{ marginLeft: -50 }} className="header-logo">

                        <Link to="/" href="">
                            <img style={{ width: 150, height: 75 }} src={logo} alt="logo" />

                        </Link>
                    </div>
                </div>

                <div className="container-fluid col-auto">
                    <div className="row">

                        <div className="col-auto" style={{ paddingRight: 100, marginLeft: -120 }}>
                            <nav>
                                <ul className="main-menu">
                                    <li className="main-menu__item main-menu__item--has-child ">
                                        <Link className="main-menu__link" style={{ color: "black", textDecoration: 'none' }} to={user && user.role === "Admin" ? "/admin" : "/"}>
                                            Home
                                        </Link>
                                    </li>

                                    <li className="main-menu__item main-menu__item--has-child">
                                        <Link className="main-menu__link" style={{ color: "black", textDecoration: 'none' }} to="/post">
                                            Post
                                        </Link>
                                    </li>


                                    {user && user.role === "Organization" && organization.organization !== null && (
                                        <li className="main-menu__item main-menu__item--has-child">
                                            <Link className="main-menu__link" style={{ color: "black" }} to={`/projects/organization/${organizationId}`}>
                                                My Projects
                                            </Link>
                                        </li>
                                    )}

                                    <li className="main-menu__item main-menu__item--has-child">
                                        <Link
                                            className="main-menu__link"
                                            style={{ color: "black", textDecoration: "none" }}
                                            to="/forum"
                                        >
                                            Forum
                                        </Link>
                                    </li>
                                    <li className="main-menu__item main-menu__item--has-child">
                                        {user && user.role === "Volunteer" && (
                                            <Link className="main-menu__link" style={{ color: "black" }} to={`/projects/completed`}>
                                                Completed Projects
                                            </Link>
                                        )}
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="d-flex align-items-center" style={{ marginInlineEnd: -405 }}>

                            {/* Notification Bell added here */}
                            {user && user.role !== 'Guest' && (
                                <>
                                    <div className="notification-wrapper" style={{ marginRight: 25 }}>
                                        <NotificationBell />
                                    </div>
                                    <Link
                                        className="main-menu__link"
                                        style={{ color: "black", textDecoration: "none", display: "flex", alignItems: "center", paddingRight: 60 }}
                                        to="/chat"
                                    >
                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-chat-right-dots"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                                                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                            </svg>
                                        </div>
                                    </Link>
                                </>
                            )}

                            {user ? (<>
                                <span className="button button--squared" style={{ height: 45, width: 100 }}>
                                    <Link
                                        style={{
                                            color: "black",
                                            pointerEvents: user.role === "Guest" ? "none" : "auto",
                                            opacity: user.role === "Guest" ? "0.5" : "1"
                                        }}
                                        to={
                                            user.role === "Organization"
                                                ? (organization?.organization === null ? "/create-organization" : "/org-profile")
                                                : user.role === "Volunteer"
                                                    ? "/profile"
                                                    : "/role" // Fallback for Guest or other roles
                                        }
                                    >
                                        {user.role === "Organization" ? (
                                            // Organization Icon (Buildings)
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-buildings" viewBox="0 0 16 16">
                                                <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                                                <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                                            </svg>
                                        ) : user.role === "Guest" ? (
                                            // Guest Icon (Person with slash - not clickable)
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-slash" viewBox="0 0 16 16">
                                                <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465l3.465-3.465Zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465Zm-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95Z" />
                                                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
                                            </svg>
                                        ) : (
                                            // Default Profile Icon (Person Circle) for Volunteer
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                            </svg>
                                        )}
                                    </Link>
                                </span>

                                <div className="button button--squared" style={{ height: 45, width: 100 }}>
                                    <Link style={{ color: "black", textDecoration: 'none' }} onClick={handleLogOut}>
                                        Log Out
                                    </Link>
                                </div>
                            </>
                            ) : (<>
                                <span className="button button--squared" style={{ height: 45, width: 100 }}>
                                    <div><Link style={{ color: "black", textDecoration: 'none' }} to="/login" >Sign In</Link></div>
                                </span>
                                <span className="button button--squared" style={{ height: 45, width: 100 }}>
                                    <div><Link style={{ color: "black", textDecoration: 'none' }} to="/register" >Sign Up</Link></div>
                                </span>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default Header2;