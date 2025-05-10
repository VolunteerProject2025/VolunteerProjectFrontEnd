 import '../assets/css/footer2.css'
const Footer2 = () => {
    return (
        <footer className="footer footer-front_2 " >
       
                <div className="row flex-none">
                    <div className="col-sm-6 col-lg-3">
                        
                        <div className="footer-contacts">
                            <p className="footer-contacts__address">Elliott Ave, Parkville VIC 3052, Melbourne Canada</p>
                            <p className="footer-contacts__phone">Phone: <a href="tel:+31859644725">+31 85 964 47 25</a></p>
                            <p className="footer-contacts__mail">Email: <a href="mailto:support@helpo.org">support@helpo.org</a></p>
                        </div>
                        <ul className="footer-socials">
                            <li className="footer-socials__item"><a className="footer-socials__link" href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                            <li className="footer-socials__item"><a className="footer-socials__link" href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                            <li className="footer-socials__item"><a className="footer-socials__link" href="#"><i className="fa fa-google-plus" aria-hidden="true"></i></a></li>
                            <li className="footer-socials__item"><a className="footer-socials__link" href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                        </ul>
                    </div>
                    <div className="col-sm-6 col-lg-4 col-xl-3 offset-xl-1">
                        <h6 className="footer__title">Menu & Links</h6>
                        <nav>
                            <ul className="footer-menu">
                                <li className="footer-menu__item footer-menu__item--active"><a className="footer-menu__link" href="index.html">Home Page</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="#">Blog & News</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="about.html">About Us</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="#">Contact Us</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="#">Pages</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="#">Elements</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="causes.html">Causes</a></li>
                                <li className="footer-menu__item"><a className="footer-menu__link" href="#">Documentation</a></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-lg-4 col-xl-3 offset-xl-1">
                        <h6 className="footer__title">Newsletter</h6>
                        <div className="footer__form">
                            <input className="footer__form-input" type="email" placeholder="Enter your E-mail"/>
                            <button className="footer__form-submit button button--primary" type="submit">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="row align-items-baseline">
                    <div className="col-md-6">
                    </div>
                    <div className="col-md-6">
                        <div className="footer-privacy">
                            <a className="footer-privacy__link" href="#">Privacy Policy</a>
                            <span className="footer-privacy__divider">|</span>
                            <a className="footer-privacy__link" href="#">Term and Condition</a>
                        </div>
                    </div>
                </div>
        </footer>
    );
};

export default Footer2;
