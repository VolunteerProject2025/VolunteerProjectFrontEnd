import React, { useEffect, useState } from 'react';
import { userProfile } from '../hooks/profileHook';
import { organizationProfile } from '../hooks/profileHook'; // Assuming orgHook contains organizationProfile
import imgProfile from '../assets/img/user_img.png';
import '../assets/css/profile.css';
import { Link } from "react-router-dom";

export function OrgProfile() {
    const { fullName, email, img_profile } = userProfile();
    const { handleOrgDetail } = organizationProfile();

    const [orgDetails, setOrgDetails] = useState(null);

    useEffect(() => {
        const fetchOrgDetails = async () => {
            try {
                const data = await handleOrgDetail();
                setOrgDetails(data);
            } catch (error) {
                console.error("Failed to fetch organization details:", error);
            }
        };
        fetchOrgDetails();
    }, []);

    return (
        <section className="info-section">
            <div className="left">
                <div className="img-container">
                    <img src={img_profile || imgProfile} alt="User Profile" />
                </div>

                <div className="user-info">
                    <h1>User Profile</h1>
                    <p className="name">{fullName}</p>
                </div>
            </div>

            <div className="right">
                <h3>Account Settings</h3>
                <section className="all-fields">
                    <div className="field">
                        <label>Full Name</label>
                        <p>{fullName}</p>
                    </div>

                    <div className="field">
                        <label>Email</label>
                        <p>{email}</p>
                    </div>
                </section>

                <div className="change-password">
                    <Link to="/change-password" className="change-password-link">
                        Change Password
                    </Link>
                </div>

                {/* Organization Details */}
                {orgDetails ? (
                    <div className="organization-info">
                        <h3>Organization Details</h3>
                        <div className="field">
                            <label>Organization Name</label>
                            <p>{orgDetails.name}</p>
                        </div>
                        <div className="field">
                            <label>Description</label>
                            <p>{orgDetails.description || 'No description available'}</p>
                        </div>
                        <div className="field">
                            <label>Contact Email</label>
                            <p>{orgDetails.contactEmail}</p>
                        </div>
                        <div className="field">
                            <label>Address</label>
                            <p>{orgDetails.address}</p>
                        </div>
                        <div className="field">
                            <label>Phone</label>
                            <p>{orgDetails.phone}</p>
                        </div>
                        <div className="field">
                            <label>Status</label>
                            <p className={`status ${orgDetails.status.toLowerCase()}`}>
                                {orgDetails.status}
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

export default OrgProfile;
