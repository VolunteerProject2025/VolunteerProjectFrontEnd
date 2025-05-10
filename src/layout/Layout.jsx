import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <>

          <div className="page-wrapper">
          <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
                <Header />
            </div>

            {/* Push content down to avoid overlap */}
            <div style={{ paddingTop: "80px" }}>
                {children}
            </div>
            <Footer />
          </div>


        </>
    );
};

export default Layout;
