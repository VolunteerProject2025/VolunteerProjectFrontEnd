import Header from "./Header";
import Footer from "./Footer";
import '../assets/css/body.css'

const Layout = ({ children }) => {
    return (
        <>
          
                <Header />
              
                    {children}
            
                <Footer />

            
        </>
    );
};

export default Layout;
