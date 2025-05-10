import React, { useEffect } from "react";
import { organizationProfile } from "../hooks/profileHook";
import { Link } from "react-router-dom";

export function OrgProfile() {
    // Get organization data and the refresh function
    const { organization, refreshOrgData } = organizationProfile();
    
    // Set up polling for real-time updates directly in the component
    useEffect(() => {
        // Refresh when component mounts
        refreshOrgData();
      }, [refreshOrgData]);
      
    console.log("Organization data:", organization);
    
    if (!organization) {
        return <p>Loading organization details...</p>;
    }

    // Access the organization data directly
    // The console shows the organization data is at organization.organization
    const orgData = organization.organization;
    
    if (!orgData) {
        return <p>Organization data not available</p>;
    }

    return (
        <>
        {/* Organization Section */}
        <section className="section team-member no-padding-bottom">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-xl-5">
                        <div className="img-box">
                            <div className="img-box__img">
                                <img className="img--bg" src={orgData.org_profile || "img/img_box-1.jpg"} alt="org-profile" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-6 offset-xl-1">
                        <div className="heading heading--primary">
                            <span className="heading__pre-title">{orgData.user.role || "Community Officer"}</span>
                            <h2 className="heading__title"><span>{orgData.name || "Organization Name"}</span></h2>
                            <p>{orgData.description || "No description available."}</p>
                            <p>Managed by: {orgData.user.fullName || "Unknown"}</p>
                            <Link to='/update-org-profile' className="button button--primary">
                                Update Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Contact Details */}
        <section className="section team-member">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-xl-5">
                        <h4 className="team-member__title">Contact Details</h4>
                        <div className="team-member__details-item">
                            <span>Phone:</span>
                            <span><a href={`tel:${orgData.phone}`}>{orgData.phone || "N/A"}</a></span>
                        </div>
                        <div className="team-member__details-item">
                            <span>Email:</span>
                            <span><a href={`mailto:${orgData.contactEmail}`}>{orgData.contactEmail || "N/A"}</a></span>
                        </div>
                        <div className="team-member__details-item">
                            <span>Location:</span>
                            <span>{orgData.address || "Unknown"}</span>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-6 offset-xl-1">
                        <ul className="aside-socials no-margin-top">
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-instagram"></i></a></li>
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-google-plus"></i></a></li>
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-twitter"></i></a></li>
                            <li className="aside-socials__item"><a className="aside-socials__link" href="#"><i className="fa fa-facebook"></i></a></li>
                        </ul>
                        <a className="button button--primary" href="#">Send Message</a>
                    </div>
                </div>
            </div>
        </section>
    </>
    );
}