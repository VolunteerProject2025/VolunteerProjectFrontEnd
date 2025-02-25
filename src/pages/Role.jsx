import { useState } from 'react';
import '../assets/login/css/bootstrap.min.css';
import '../assets/login/css/fontawesome-all.min.css';
import '../assets/login/css/iofrm-style.css';
import '../assets/login/css/iofrm-theme43.css';
import { useChooseRole } from '../hooks/useAuth'

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
        <div className="form-body form-left">
            <div className="iofrm-layout">
                <div className="img-holder">
                    <div className="bg"></div>
                </div>
                <div className="form-holder">
                    <div className="form-content">
                        <div className="form-items">
                            <div className="website-logo-inside logo-normal">
                                <a href="/">
                                    <div className="logo">
                                        <img className="logo-size" src="images/logo-pink.svg" alt="logo" />
                                    </div>
                                </a>
                            </div>
                            <h3 className="font-md">Get more things done with Role platform.</h3>
                            <p>Access to the most powerful tool in the entire design and web industry.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="btn-group w-100">
                                    <button
                                        type="button"
                                        className={`btn ${roleData.role === 'Volunteer' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                        onClick={() => handleRoleSelect('Volunteer')}
                                    >
                                        Volunteer
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${roleData.role === 'Organization' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                        onClick={() => handleRoleSelect('Organization')}
                                    >
                                        Organization
                                    </button>
                                </div>
                                <div className="form-button d-flex mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={!roleData.role}
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}