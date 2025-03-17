import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import '../assets/css/header.css';
import logo from '../assets/home/img/logo_mono.png';
import imgProfile from '../assets/img/user_img.png'
import { organizationProfile } from "../hooks/profileHook";
const Header2 = () => {
    const navigate = useNavigate();
    const organization = organizationProfile();
    

const organizationId = organization?.organization?.organization?._id;


    

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
        <>
            <div className="mobile-nav">
                <div className="mobile-nav__inner">
                    <div className="mobile-nav__item">
                        <nav className="menu-holder">
                            <ul className="mobile-menu">
                                <li className="mobile-menu__item"><a className="mobile-menu__link" href="#">item</a></li>
                                <li className="mobile-menu__item"><a className="mobile-menu__link" href="#">item</a></li>
                                <li className="mobile-menu__item"><a className="mobile-menu__link" href="#">item</a></li>
                                <li className="mobile-menu__item"><a className="mobile-menu__link" href="#">item</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="aside-dropdown">
                <div className="aside-dropdown__inner"><span className="aside-dropdown__close">
                    <svg className="icon">
                        <use xlink:href="#close"></use>
                    </svg></span>
                    <div className="aside-dropdown__item d-lg-none d-block">
                        <ul className="aside-menu">
                            <li className="aside-menu__item aside-menu__item--has-child aside-menu__item--active"><a className="aside-menu__link" href="#"><span>Home</span></a>
                                <ul className="aside-menu__sub-list">
                                    <li><a href="../index.html"><span>01 Home Color Style</span></a></li>
                                    <li><a href="../front_2.html"> <span>02 Home Color Style</span></a></li>
                                    <li><a href="../front_3.html"><span>03 Home Color Style</span></a></li>
                                    <li><a href="index.html"><span>04 Home Monochrome</span></a></li>
                                    <li className="item--active"><a href="front_2.html"><span>05 Home Monochrome</span></a></li>
                                    <li><a href="front_3.html"><span>06 Home Monochrome</span></a></li>
                                </ul>
                            </li>
                            <li className="aside-menu__item aside-menu__item--has-child"><a className="aside-menu__link" href="#"><span>Pages</span></a>
                                <ul className="aside-menu__sub-list">
                                    <li><a href="about.html"><span>About</span></a></li>
                                    <li><a href="typography.html"> <span>Typography</span></a></li>
                                    <li><a href="donors.html"><span>Donors & Partners</span></a></li>
                                    <li><a href="volunteer.html"><span>Become a Volunteer</span></a></li>
                                    <li><a href="events.html"><span>Events</span></a></li>
                                    <li><a href="event-details.html"><span>Event Details</span></a></li>
                                    <li><a href="stories.html"><span>Stories</span></a></li>
                                    <li><a href="storie-details.html"><span>Storie Details</span></a></li>
                                    <li><a href="blog.html"><span>Blog</span></a></li>
                                    <li><a href="blog-post.html"><span>Blog Post</span></a></li>
                                    <li><a href="gallery.html"><span>Gallery</span></a></li>
                                    <li><a href="pricing.html"><span>Pricing Plans</span></a></li>
                                    <li><a href="faq.html"><span>FAQ</span></a></li>
                                    <li><a href="404.html"><span>404 Page</span></a></li>
                                </ul>
                            </li>
                            <li className="aside-menu__item aside-menu__item--has-child"><a className="aside-menu__link" href="#"><span>Causes</span></a>
                                <ul className="aside-menu__sub-list">
                                    <li><a href="causes.html"><span>Causes 1</span></a></li>
                                    <li><a href="causes_2.html"> <span>Causes 2</span></a></li>
                                    <li><a href="causes_3.html"><span>Causes 3</span></a></li>
                                    <li><a href="cause-details.html"><span>Cause Details</span></a></li>
                                </ul>
                            </li>
                            <li className="aside-menu__item aside-menu__item--has-child"><a className="aside-menu__link" href="#"><span>Shop</span></a>
                                <ul className="aside-menu__sub-list">
                                    <li><a href="shop.html"><span>Catalog Page</span></a></li>
                                    <li><a href="shop-product.html"><span>Shop Product</span></a></li>
                                    <li><a href="shop-cart.html"><span>Shop Cart</span></a></li>
                                    <li><a href="shop-checkout.html"><span>Shop Checkout</span></a></li>
                                    <li><a href="shop-account.html"><span>Shop Account</span></a></li>
                                </ul>
                            </li>
                            <li className="aside-menu__item"><a className="aside-menu__link" href="contacts.html"><span>Contacts</span></a></li>
                            <li className="aside-menu__item aside-menu__item--has-child"><a className="aside-menu__link" href="#"><span>Elements</span></a>
                                <ul className="aside-menu__sub-list">
                                    <li><a href="alerts.html"><span>Alerts</span></a></li>
                                    <li><a href="team.html"><span>Team</span></a></li>
                                    <li><a href="testimonials.html"><span>Testimonials</span></a></li>
                                    <li><a href="accordion.html"><span>Accordion</span></a></li>
                                    <li><a href="tabs.html"><span>Tabs</span></a></li>
                                    <li><a href="pricing-plan.html"><span>Pricing Plan</span></a></li>
                                    <li><a href="counters.html"><span>Counters</span></a></li>
                                    <li><a href="icons.html"><span>Icons</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className="aside-dropdown__item">
                        <ul className="aside-menu">
                            <li className="aside-menu__item"><a className="aside-menu__link" href="#">Documents</a></li>
                            <li className="aside-menu__item"><a className="aside-menu__link" href="#">Information</a></li>
                            <li className="aside-menu__item"><a className="aside-menu__link" href="#">Additional Pages</a></li>
                            <li className="aside-menu__item"><a className="aside-menu__link" href="/project">Project</a></li>
                            <li className="aside-menu__item"><a className="aside-menu__link" href="#">Contacts</a></li>
                        </ul>
                        <div className="aside-inner"><span className="aside-inner__title">Email</span><a className="aside-inner__link" href="mailto:support@helpo.org">support@helpo.org</a></div>
                        <div className="aside-inner"><span className="aside-inner__title">Phone numbers</span><a className="aside-inner__link" href="tel:+180012345678">+ 1800 - 123 456 78</a><a className="aside-inner__link" href="tel:+18009756511">+ 1800 - 975 65 11</a></div>
                        <ul className="aside-socials">
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-google-plus" aria-hidden="true"></i></a></li>
                            <li className="aside-socials__item"><a className="aside-socials__link aside-socials__link--active" href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                        </ul>
                    </div>
                    <div className="aside-dropdown__item"><a className="button button--squared" href="#"> <span>Donate</span></a></div>
                </div>
            </div>

            <header className="header header--front_2">
                <div className="container-fluid">
                    <div className="row no-gutters justify-content-between">
                        <div className="col-auto d-flex align-items-center">
                            <div className="dropdown-trigger d-none d-sm-block">
                                <div className="dropdown-trigger__item"></div>
                            </div>
                            <div className="header-logo">
                                <a className="header-logo__link" href="">
                                <Link to="/" >
                                <img className="header-logo__img" src={logo} alt="logo" />

                                </Link>
                                </a></div>
                        </div>
                        <div className="col-auto">
                            <nav>
                                <ul className="main-menu">
                                    <li className="main-menu__item main-menu__item--has-child main-menu__item--active"><a className="main-menu__link" href="#"><span>Home</span></a>
                                        <ul className="main-menu__sub-list">
                                            <li><a href="../index.html"><span>01 Home Color Style</span></a></li>
                                            <li><a href="../front_2.html"><span>02 Home Color Style</span></a></li>
                                            <li><a href="../front_3.html"><span>03 Home Color Style</span></a></li>
                                            <li><a href="index.html"><span>04 Home Monochrome</span></a></li>
                                            <li className="item--active"><a href="front_2.html"><span>05 Home Monochrome</span></a></li>
                                            <li><a href="front_3.html"><span>06 Home Monochrome</span></a></li>
                                        </ul>
                                    </li>
                                    <li className="main-menu__item main-menu__item--has-child"><a className="main-menu__link" href="#"><span>Pages</span></a>
                                        <ul className="main-menu__sub-list sub-list--style-2">
                                            <li><a href="about.html"><span>About</span></a></li>
                                            <li><a href="typography.html"> <span>Typography</span></a></li>
                                            <li><a href="donors.html"><span>Donors & Partners</span></a></li>
                                            <li><a href="volunteer.html"><span>Become a Volunteer</span></a></li>
                                            <li><a href="events.html"><span>Events</span></a></li>
                                            <li><a href="event-details.html"><span>Event Details</span></a></li>
                                            <li><a href="stories.html"><span>Stories</span></a></li>
                                            <li><a href="storie-details.html"><span>Story Details</span></a></li>
                                            <li><a href="blog.html"><span>Blog</span></a></li>
                                            <li><a href="blog-post.html"><span>Blog Post</span></a></li>
                                            <li><a href="gallery.html"><span>Gallery</span></a></li>
                                            <li><a href="pricing.html"><span>Pricing Plans</span></a></li>
                                            <li><a href="faq.html"><span>FAQ</span></a></li>
                                            <li><a href="404.html"><span>404 Page</span></a></li>
                                        </ul>
                                    </li>
                                    <li className="main-menu__item main-menu__item--has-child"><a className="main-menu__link" href="#"><span>Causes</span></a>
                                        <ul className="main-menu__sub-list">
                                            <li><a href="causes.html"><span>Causes 1</span></a></li>
                                            <li><a href="causes_2.html"> <span>Causes 2</span></a></li>
                                            <li><a href="causes_3.html"><span>Causes 3</span></a></li>
                                            <li><a href="cause-details.html"><span>Cause Details</span></a></li>
                                        </ul>
                                    </li>
                                    <li className="main-menu__item main-menu__item--has-child">
                                    <a className="main-menu__link" href={`/#/projects/organization/${organizationId}`}>
                                    <span>My Project</span>
                                        </a>
                                        <ul className="main-menu__sub-list">
                                            <li><a href="shop.html"><span>Catalog Page</span></a></li>
                                            <li><a href="shop-product.html"><span>Shop Product</span></a></li>
                                            <li><a href="shop-cart.html"><span>Shop Cart</span></a></li>
                                            <li><a href="shop-checkout.html"><span>Shop Checkout</span></a></li>
                                            <li><a href="shop-account.html"><span>Shop Account</span></a></li>
                                        </ul>
                                    </li>
                                    <li className="main-menu__item"><a className="main-menu__link" href="contacts.html"><span>Contacts</span></a></li>
                                    <li className="main-menu__item main-menu__item--has-child"><a className="main-menu__link" href="/#/project"><span>Project</span></a>
                                        <ul className="main-menu__sub-list">
                                            <li><a href="alerts.html"><span>Alerts</span></a></li>
                                            <li><a href="team.html"><span>Team</span></a></li>
                                            <li><a href="testimonials.html"><span>Testimonials</span></a></li>
                                            <li><a href="accordion.html"><span>Accordion</span></a></li>
                                            <li><a href="tabs.html"><span>Tabs</span></a></li>
                                            <li><a href="pricing-plan.html"><span>Pricing Plan</span></a></li>
                                            <li><a href="counters.html"><span>Counters</span></a></li>
                                            <li><a href="icons.html"><span>Icons</span></a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <ul className="lang-select">
                                <li className="lang-select__item lang-select__item--active"><span>En</span>
                                    <ul className="lang-select__sub-list">
                                        <li><a href="#">French</a></li>
                                        <li><a href="#">Spanish</a></li>
                                        <li><a href="#">Deutsch</a></li>
                                        <li><a href="#">Russian</a></li>
                                    </ul>
                                </li>
                            </ul>

                            {user ? (<>
                                <span className="button button--squared" >
                                    <Link to={user.role == "Organization" ? "/org-profile" : "/profile"}>
                                        Welcome,   {user.fullName}!
                                    </Link>
                                </span>
                                <div className="button button--squared">
                                    <Link onClick={logout}>
                                        Log Out
                                    </Link>
                                </div>


                            </>


                            ) : (<>
                                <span className="button button--squared">
                                    <div><Link to="/login" >Log In</Link></div>

                                </span>
                                <span className="button button--squared">
                                    <div><Link to="/register" >Sign Up</Link></div>
                                </span>
                            </>

                            )}

                            <div className="dropdown-trigger d-block d-sm-none">
                                <div className="dropdown-trigger__item"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default Header2;