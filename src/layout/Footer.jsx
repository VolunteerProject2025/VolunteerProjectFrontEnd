import '../assets/css/footer.css'

const Footer = () => {
    return (
        <footer>
            <section className="links-section">
                <div>
                    <h6>Your Account</h6>
                    <a href="#">Sign Up</a>
                    <a href="#">Log In</a>
                    <a href="#">Contact Us</a>
                </div>

                <div>
                    <h6>Discover</h6>
                    <a href="#">Events</a>
                    <a href="#">Cities</a>
                    <a href="#">Categories</a>
                    <a href="#">Upcoming events</a>
                </div>

                <div>
                    <h6>Discover</h6>
                    <a href="#">Events</a>
                    <a href="#">Cities</a>
                    <a href="#">Categories</a>
                    <a href="#">Upcoming events</a>
                </div>
            </section>

            <section className="follow-us">
                <h6>Follow us</h6>

                <div className="socials">
                    <a href="#"><img src="../images/github.png" alt="GitHub" /></a>
                    <a href="#"><img src="../images/linkedin.png" alt="LinkedIn" /></a>
                    <a href="#"><img src="../images/facebook.png" alt="Facebook" /></a>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
