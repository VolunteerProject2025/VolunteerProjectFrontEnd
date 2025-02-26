import { HashRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Role } from './pages/Role';
import Layout from './layout/Layout';
import { AuthProvider } from "./context/AuthContext"; 
import { Profile } from './pages/Profile';
import { ChangePassword } from './pages/ChangePassword';
import PrivateRoute from './context/PrivateRoute'; // Import the PrivateRoute component
import { Unauthorized } from './pages/Unauthorized';
function App() {
    return (
        <div>
            <AuthProvider>
                <HashRouter>
                    <Routes>
                        <Route path='/login' element={<Layout><Login /></Layout>} />
                        <Route path='/register' element={<Layout><Register /></Layout>} />
                        <Route path='/' element={<Layout><Home /></Layout>} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        
                        {/* Protect these routes with PrivateRoute */}
                        <Route path='/change-password' element={
                            <PrivateRoute>
                                <Layout><ChangePassword /></Layout>
                            </PrivateRoute>
                        } />
                        <Route path='/profile' element={
                            <PrivateRoute allowedRoles={['Volunteer','Admin']}>
                                <Layout><Profile /></Layout>
                            </PrivateRoute>
                        } />
                        <Route path='/role' element={
                            <PrivateRoute>
                                <Layout><Role /></Layout>
                            </PrivateRoute>
                        } />
                    </Routes>
                </HashRouter>
            </AuthProvider>
        </div>
    );
}

export default App;
