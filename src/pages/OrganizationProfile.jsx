import React, { useEffect, useState } from 'react';
import { organizationProfile } from '../hooks/profileHook'; // Assuming orgHook contains organizationProfile
import imgProfile from '../assets/img/user_img.png';
import '../assets/css/profile.css';
import { Link } from "react-router-dom";

export function OrgProfile() {
    const { organization  } = organizationProfile();

    return (
        <section className="info-section">
            <div className="left">
                <div className="img-container">
                    {/* <img src={organization.img_profile || imgProfile} alt="User Profile" /> */}
                </div>

                <div className="user-info">
                    <h1>Organization Profile</h1>
                    <p className="name">{organization.name}</p>
                </div>
            </div>

            <div className="right">
                <h3>Organization Settings</h3>
                

                <div className="change-password">
                    <Link to="/change-password" className="change-password-link">
                        Change Password
                    </Link>
                </div>

                {/* Organization Details */}
                    {organization  ? (
                        <div className="organization-info">
                            <div className="field">
                                <label>Organization Name</label>
                                <p>{organization.name}</p>
                            </div>
                            <div className="field">
                                <label>Description</label>
                                <p>{organization.description || 'No description available'}</p>
                            </div>
                            <div className="field">
                                <label>Contact Email</label>
                                <p>{organization.contactEmail}</p>
                            </div>
                            <div className="field">
                                <label>Address</label>
                                <p>{organization.address}</p>
                            </div>
                            <div className="field">
                                <label>Phone</label>
                                <p>{organization.phone}</p>
                            </div>
                            <div className="field">
                                <label>Status</label>
                                <p >
                                    {organization.status}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading organization details...</p>
                    )}
            </div>
        </section>
    );
}


