import Header2 from "./Header2";
import Footer2 from "./Footer2";
import Slidebar from "./Slidebar";
import '../assets/css/body.css';

const AdminLayout = ({ children }) => {
    return (

            <div className="admin-wrapper">
                
                    <Header2 />
            
                    <Slidebar />

                <main className="Adminmain">
                    {children}
                </main>
            </div>
    );
};

export default AdminLayout;
