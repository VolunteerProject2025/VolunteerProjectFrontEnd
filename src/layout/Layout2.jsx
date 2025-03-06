import Header2 from "./Header2";
import Footer2 from "./Footer2";
import '../assets/css/body.css'
const Layout = ({ children }) => {
    return (
    
            <div className="page-wrapper">
       
                <Header2  />

                <main className="main main-margin">
                    {children}
                </main>
                <Footer2 />
            </div>


   
    );
};

export default Layout;
