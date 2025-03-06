import logoSM from '../assets/img/volunteer_act_logo_cut.png';
import '../assets/css/body.css';

const Slidebar = () => {
    return (
        <>
            <div className="app-menu navbar-menu mt-50">
                <div id="scrollbar">
                    <div className="container-fluid">
                    <div className="navbar-brand-box horizontal-logo">
                        <a href="index.html">
                            <span className="logo-sm">
                                <img src={logoSM} alt="aaa" height="40" />
                            </span>
                        </a>
                    </div>
                        <ul className="navbar-nav" id="navbar-nav">
                            <li className="nav-item">
                                <a href="/#/admin" className="nav-link menu-link"> <span data-key="t-dashboard">Dashboard</span></a>
                            </li>

                            <li className="nav-item">
                                <a href="/#/admin/users" className="nav-link menu-link"> <span data-key="t-calendar">Users</span> </a>
                            </li>

                            <li className="nav-item">
                                <a href="/#/admin/organizations" className="nav-link menu-link"> <span data-key="t-users-list">Organizations</span> </a>
                            </li>

                            <li className="nav-item">
                                <a href="/#/admin/projects" className="nav-link menu-link"> <span data-key="t-coupons">Projects</span> </a>
                            </li>   
                            <li className="nav-item">
                                <a href="/#/admin/feedbacks" className="nav-link menu-link"> <span data-key="t-reviews-ratings">Reviews & Ratings</span></a>
                            </li>
                            <li className="nav-item">
                                <a href="/#/admin/pendingOrg" className="nav-link menu-link"> <span data-key="t-reviews-ratings">Approve Organization</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Slidebar;
