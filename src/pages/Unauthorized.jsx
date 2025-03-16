import { AuthContext } from '../context/AuthContext';
import { useEffect, useContext, useState } from "react";
export function Unauthorized ()  {
    const { user, organization } = useContext(AuthContext);

    const renderMessage = () => {
        if (user?.role === 'Organization' && organization?.organization?.status !== 'Approved') {
            return (
                <div>
                    <h2>Unauthorized Access</h2>
                    <p>Your organization account is currently pending approval. 
                       Please wait for admin verification before accessing these features.</p>
                </div>
            );
        }
        return (
            <div>
                <h2>Unauthorized Access</h2>
                <p>You do not have permission to access this page.</p>
            </div>
        );
    };

    return (
       <>
            {renderMessage()}
        </>
        
    );
};