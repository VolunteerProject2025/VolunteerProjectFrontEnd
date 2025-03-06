import React, { useState, useContext } from 'react';
import { organizationProfile } from '../hooks/profileHook';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/profile.css';
import { Link } from "react-router-dom";
import axios from 'axios';
const ORG_API_URL = `${import.meta.env.VITE_API_URL}/org`;

export function OrgProfile() {
    const { organization } = organizationProfile();
    const { organization: contextOrganization ,updateOrganization } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrg, setEditedOrg] = useState({
        name: '',
        description: '',
        contactEmail: '',
        address: '',
        phone: ''
    });

    // Start editing mode
    const handleEditClick = () => {
        if (contextOrganization) {
            setEditedOrg({
                name: contextOrganization.name,
                description: contextOrganization.description || '',
                contactEmail: contextOrganization.contactEmail,
                address: contextOrganization.address,
                phone: contextOrganization.phone
            });
            setIsEditing(true);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedOrg(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit edited organization details
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${ORG_API_URL}/edit-org`, editedOrg, { 
                withCredentials: true 
            });
            
            // Refetch organization to update the context
            updateOrganization(response.data.organization);
            // Exit editing mode
            setIsEditing(false);
        } catch (error) {
            // Error handling remains the same as in your original code
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                alert(`Update failed: ${error.response.data.message || 'Unauthorized'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                alert('No response from server');
            } else {
                console.error('Error setting up request:', error.message);
                alert('Error setting up request');
            }
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Render view mode
    const renderViewMode = () => (
        <>
            <h3>Organization Settings</h3>
            
            <div className="change-password">
                <Link to="/change-password" className="change-password-link">
                    Change Password
                </Link>
            </div>

            {contextOrganization ? (
                <div className="organization-info">
                    <div className="field">
                        <label>Organization Name</label>
                        <p>{contextOrganization.name}</p>
                    </div>
                    <div className="field">
                        <label>Description</label>
                        <p>{contextOrganization.description || 'No description available'}</p>
                    </div>
                    <div className="field">
                        <label>Contact Email</label>
                        <p>{contextOrganization.contactEmail}</p>
                    </div>
                    <div className="field">
                        <label>Address</label>
                        <p>{contextOrganization.address}</p>
                    </div>
                    <div className="field">
                        <label>Phone</label>
                        <p>{contextOrganization.phone}</p>
                    </div>
                    <div className="field">
                        <label>Status</label>
                        <p>{contextOrganization.status}</p>
                    </div>
                    <div className="change-password">
                    <button 
                        onClick={handleEditClick} 
                        className="change-password-link"
                    >
                        Edit Organization
                    </button>
                    </div>
                   
                </div>
            ) : (
                <p>Loading organization details...</p>
            )}
        </>
    );

    // Render edit mode
    const renderEditMode = () => (
        <>
            <h3>Edit Organization Details</h3>
            <form onSubmit={handleSubmit} className="edit-org-form">
                <div className="field">
                    <label>Organization Name</label>
                    <input
                        type="text"
                        name="name"
                        value={editedOrg.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="field">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={editedOrg.description}
                        onChange={handleInputChange}
                        rows="3"
                    />
                </div>
                <div className="field">
                    <label>Contact Email</label>
                    <input
                        type="email"
                        name="contactEmail"
                        value={editedOrg.contactEmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="field">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={editedOrg.address}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="field">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={editedOrg.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button 
                        type="button" 
                        onClick={handleCancelEdit} 
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <section className="info-section">
            <div className="left">
                <div className="user-info">
                    <h1>Org Profile</h1>
                    <p className="name">{contextOrganization?.name}</p>
                </div>
            </div>

            <div className="right">
                {isEditing ? renderEditMode() : renderViewMode()}
            </div>
        </section>
    );
}