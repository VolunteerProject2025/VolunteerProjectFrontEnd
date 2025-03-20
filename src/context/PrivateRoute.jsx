import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children, allowedRoles = [], requireApprovedOrg = false }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        console.error('AuthContext is not available');
        return <Navigate to="/login" />;
    }

    const { user, loading, organization } = authContext;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Ensure allowedRoles is always an array and validate user role
    console.log('Allowed Roles:', allowedRoles);
    console.log('User Role:', user.role);
    console.log('Allowed Roles Length:', Array.isArray(allowedRoles) ? allowedRoles.length : 'Not an array');

    const isRoleAllowed = Array.isArray(allowedRoles) && (allowedRoles.length === 0 || allowedRoles.includes(user.role));
    console.log('Is Role Allowed:', isRoleAllowed);

    // Validate organization status if required
    const isOrganizationApproved = !requireApprovedOrg ||
        (user.role === 'Organization' && organization?.organization?.status === 'Approved');
    console.log('User Status:', user.status);
    console.log('Organization Status:', organization?.organization?.status);
    console.log('Require Approved Org:', requireApprovedOrg);
    console.log('Is Organization Approved:', isOrganizationApproved);

    if (!isRoleAllowed || !isOrganizationApproved || user.status !== 'Active') {
        console.warn('Access Denied - Redirecting to Unauthorized');
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;