import { useState } from 'react';
import '../assets/css/login.css';

import { useChooseRole } from '../hooks/authHook'

export function Role() {
    const chooseRole = useChooseRole();
    const [roleData, setRoleData] = useState({ role: '' });

    const handleRoleSelect = (selectedRole) => {
        setRoleData({ role: selectedRole });
    };
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting with role:", roleData);
        if (!roleData.role) {
            console.log("No role selected");
            alert('Please select a role before proceeding.');
            return;
        }
        try {
            console.log("Calling chooseRole");
            await chooseRole(roleData);
            console.log("chooseRole completed"); 
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    return (
        <div className="login-container">
        <div className="login-box">
            <h1 className="welcome-text">Welcome Back</h1>
            <p className="subtitle">Log in to continue</p>

            <form onSubmit={handleSubmit}>
                                <div className="btn-group w-100">
                                    <button
                                    type='button'
                                        className={`btn ${roleData.role === 'Volunteer' ?  'btn-google':'login-btn' }`}
                                        onClick={() => handleRoleSelect('Volunteer')}
                                    >
                                        Volunteer
                                    </button>
                                    <button
                                    type='button'

                                        className={`btn ${roleData.role === 'Organization' ?  'btn-google':'login-btn'}`}
                                        onClick={() => handleRoleSelect('Organization')}
                                    >
                                        Organization
                                    </button>
                                </div>
                                <div className="form-button d-flex mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn login-btn"
                                        disabled={!roleData.role}
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
        </div>
    </div>
       
    );
}