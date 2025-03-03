import Header2 from "./Header2";
import Footer2 from "./Footer2";

const Layout = ({ children }) => {
    return (
    
            <div className="page-wrapper">
       
                <Header2  />

                <main className="main">
                    {children}
                </main>
                <Footer2 />
            </div>


   
    );
};

export default Layout;
