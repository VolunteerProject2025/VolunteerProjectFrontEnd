import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // Show a loading indicator while the authentication status is being checked
    if (loading) {
        return <div>Loading...</div>;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If user is authenticated, render the children (protected route)
    return children;
};

export default PrivateRoute;
