import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children, allowedRoles, requireApprovedOrg = false }) => {
    const authContext = useContext(AuthContext);

    // Log the entire context to see what's available
    

    // If context is not available at all
   

    const { user, loading, organization } = authContext;

    // Detailed logging
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Role validation
    const normalizedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    const isRoleAllowed = !allowedRoles?.length || allowedRoles.includes(normalizedRole);

    // Organization status validation
    const isOrganizationApproved = !requireApprovedOrg || 
        (user.role === 'Organization' && organization?.organization?.status === 'Approved');

  

    if (!isRoleAllowed || !isOrganizationApproved) {
        console.warn('Access Denied - Redirecting to Unauthorized');
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;