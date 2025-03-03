import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles?.length && !allowedRoles.includes(user.role.charAt(0).toUpperCase() + user.role.slice(1))) {
        return <Navigate to="/unauthorized" />;
    }
    

    return children;
};

export default PrivateRoute;
