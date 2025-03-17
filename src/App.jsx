import { HashRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Role } from './pages/Role';
import { AuthProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

import { NotificationProvider } from "./context/NotificationContext";
import { Profile } from './pages/Profile';
import { ChangePassword } from './pages/ChangePassword';
import PrivateRoute from './context/PrivateRoute'; // Import the PrivateRoute component
import { Unauthorized } from './pages/Unauthorized';
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { OrgProfile } from './pages/OrgProfile';
import { UpdateOrgProfile } from './pages/UpdateOrgProfile';
import { PostList } from './pages/PostList';
import { PostForm } from './pages/PostForm';
import { CreateProject } from "./pages/CreateProject";
import { CreateSchedule } from "./pages/ScheduleForm";
import {CreateOrganization} from './pages/CreateOrganization'
import { ProjectList } from "./pages/ProjectList";
import { ProjectDetails } from "./pages/ProjectDetails";
import { UpdateProject } from "./pages/UpdateProject";
import { DeleteProject } from "./pages/DeleteProject";
import Layout2 from './layout/Layout2';
import AdminLayout from './layout/AdminLayout';
import { Home2 } from './pages/Home2';
import { AdminHome } from './pages/AdminHome';
import { UsersManagement } from './pages/UsersManagement';
import { OrganizationsManagement } from './pages/OrganizationsManagement';
import { ProjectsManagements } from './pages/ProjectsManagements';
import { FeedbacksManagements } from './pages/FeedbacksManagements';
import { ApproveOrganization } from './pages/ApproveOrganization';
import { PendingProjects } from './pages/PendingProject';
import { Chat } from './pages/Chat';
import { ProfileEdit } from "./pages/ProfileEdit";
import { OrgProjectList } from './pages/OrgProjectList';
function App() {
    return (
        <div>
            <AuthProvider>
   <ChatContextProvider>

                <NotificationProvider>
                    <HashRouter>
                        
                        <Routes>
                        <Route path='/edit-profile' element={
                            <PrivateRoute allowedRoles={['Volunteer', 'Admin']}>
                                <Layout2><ProfileEdit /></Layout2>
                            </PrivateRoute>
                        } />

                                <Route path='/chat' element={<PrivateRoute
                                ><Layout2><Chat /></Layout2></PrivateRoute>} />

                            <Route path='/login' element={<Layout2><Login /></Layout2>} />
                            <Route path='/register' element={<Layout2><Register /></Layout2>} />
                            <Route path='/' element={<Layout2><Home2 /></Layout2>} />
                            <Route path="/unauthorized" element={<Layout2><Unauthorized /></Layout2>} />
                            <Route path="/forgot-password" element={<Layout2><ForgotPassword /></Layout2>} />
                            <Route path="/reset-password" element={<Layout2><ResetPassword /></Layout2>} />
                            <Route path="/post" element={<Layout2><PostList /></Layout2>} />
                            <Route path="/add" element={
                                <PrivateRoute
                                >
                                    <Layout2><PostForm /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path="/edit/:id" element={
                                <PrivateRoute
                                    allowedRoles={['Organization']}
                                    requireApprovedOrg={true}
                                >
                                    <Layout2><PostForm /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path='/change-password' element={
                                <PrivateRoute>
                                    <Layout2><ChangePassword /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path="/project" element={<Layout2><ProjectList /></Layout2>} />
                            <Route path="/projects/organization/:organizationId" element={  <PrivateRoute
                                    allowedRoles={['Organization']}
                                    requireApprovedOrg={true}
                                >
                                    <Layout2><OrgProjectList /></Layout2>
                                </PrivateRoute>} />
                            <Route path='/create' element={
                                <PrivateRoute
                                    allowedRoles={['Organization']}
                                    requireApprovedOrg={true}
                                >
                                    <Layout2><CreateProject /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path='/create-organization' element={
                                <PrivateRoute
                                    allowedRoles={['Organization']}
                                    
                                >
                                    <Layout2><CreateOrganization /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path='/create-schedule/:id' element={
                                <PrivateRoute
                                    allowedRoles={['Organization']}
                                    requireApprovedOrg={true}
                                >
                                    <Layout2><CreateSchedule /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path="/projects/:id" element={<Layout2><ProjectDetails /></Layout2>} />
                            <Route path="/projects/:id/edit" element={
                                <PrivateRoute
                                    allowedRoles={['Organization']}
                                    requireApprovedOrg={true}
                                >
                                    <Layout2><UpdateProject /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path="/delete" element={<PrivateRoute
                                    allowedRoles={['Organization']}
                                    requireApprovedOrg={true}
                                >
                                    <Layout2><DeleteProject /></Layout2>
                                </PrivateRoute>} />
                            <Route path='/profile' element={
                                <PrivateRoute allowedRoles={['Volunteer', 'Admin']}>
                                    <Layout2><Profile /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path='/org-profile' element={
                                <PrivateRoute allowedRoles={['Organization']}>
                                    <Layout2><OrgProfile /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path='/update-org-profile' element={
                                <PrivateRoute allowedRoles={['Organization']}>
                                    <Layout2><UpdateOrgProfile /></Layout2>
                                </PrivateRoute>
                            } />
                            <Route path='/role' element={
                                <Layout2><Role /></Layout2>
                            } />
                            <Route path='/admin' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><AdminHome /></AdminLayout></PrivateRoute>} />
                            <Route path='/admin/users' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><UsersManagement /></AdminLayout></PrivateRoute>} />
                            <Route path='/admin/organizations' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><OrganizationsManagement /></AdminLayout></PrivateRoute>} />
                            <Route path='/admin/projects' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><ProjectsManagements /></AdminLayout></PrivateRoute>} />
                            <Route path='/admin/feedbacks' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><FeedbacksManagements /></AdminLayout></PrivateRoute>} />
                            <Route path='/admin/pendingOrg' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><ApproveOrganization /></AdminLayout></PrivateRoute>} />
                            <Route path='/admin/pendingProjects' element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout><PendingProjects /></AdminLayout></PrivateRoute>} />

                        </Routes>
                    </HashRouter>
                </NotificationProvider>
            </ChatContextProvider>

            </AuthProvider>

        </div>
    );
}

export default App;