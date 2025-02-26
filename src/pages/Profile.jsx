import React from 'react';
import { userProfile} from '../hooks/profileHook' 
import imgProfile from '../assets/img/user_img.png'
import '../assets/css/profile.css'
import { Link } from "react-router-dom";

export function Profile () {
    const { fullName, email, img_profile } = userProfile();
    return (
        <section className="info-section">
            <div className="left">
                <div className="img-container">
                <img src={img_profile|| imgProfile} alt="User Profile" />
                </div>

                <div className="user-info">
                <h1>User Profile</h1>
                    <p className="name">{fullName}</p>

                </div>
            </div>

            <div className="right">
                <h3>Account Settings</h3>
                <section class="all-fields">
                    <div className='field'>
                    <label>Full Name</label>
                    <p>{fullName}</p>

                    </div>
                   
                    <div className='field'>
                    <label>Email</label>
                    <p>{email}</p>

                    </div>
                  
                </section>
                <div className="change-password">
                    <Link to="/change-password" className="change-password-link">
                        Change Password
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Profile;
