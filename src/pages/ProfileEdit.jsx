import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    Container, TextField, Button, Card, CardContent, Typography, MenuItem, Box, Chip, Autocomplete,
    Avatar, IconButton
} from "@mui/material";
import { useProfile } from "../hooks/profileHook";
import { format, parseISO } from "date-fns";

export function ProfileEdit() {
    const { isAuthenticated, isLoading, error, userProfile } = useProfile();
    const navigate = useNavigate();

    // State for form data
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        location: "",
        bio: "",
        skills: []
    });

    // State for image upload
    const [profileImage, setProfileImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [skillsList, setSkillsList] = useState([]);

    // Fetch skills list from backend
    useEffect(() => {
        fetch("http://localhost:3000/skills")
            .then(res => res.json())
            .then(data => setSkillsList(data))
            .catch(err => console.error("❌ Error fetching skills:", err));
    }, []);

    // Set initial form data from user profile
    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.fullName || "",
                email: userProfile.email || "",
                phone: userProfile.phone || "",
                gender: userProfile.gender || "",
                dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0] : "",
                location: userProfile.location || "",
                bio: userProfile.bio || "",
                skills: userProfile.skills || []
            });
            
            // Set current profile image if available
            if (userProfile.profileImage) {
                setCurrentImage(userProfile.profileImage);
            }
        }
    }, [userProfile]);

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle skills selection changes
    const handleSkillChange = (event, newValue) => {
        setFormData({ ...formData, skills: newValue });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            
            // Create a preview of the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create FormData object to handle file upload
            const formDataToSend = new FormData();
            
            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (key === 'skills') {
                    // For skills array, stringify it to preserve the object structure
                    formDataToSend.append('skills', JSON.stringify(formData.skills));
                } else if (key === 'dateOfBirth' && formData[key]) {
                    // Format date properly
                    formDataToSend.append(key, format(parseISO(formData[key]), "yyyy-MM-dd"));
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Add profile image if selected
            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }
            
            // Send the update request
            const response = await fetch("http://localhost:3000/volunteers/me", {
                method: "PUT",
                body: formDataToSend,
                credentials: "include",
                // Don't set Content-Type header when using FormData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile.");
            }
    
            Swal.fire({
                title: "Success!",
                text: "Your profile has been updated successfully.",
                icon: "success",
                confirmButtonText: "Continue"
            }).then(() => {
                navigate("/profile");
            });
    
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            Swal.fire("Error", error.message, "error");
        }
    };

    if (!isAuthenticated) return <Typography color="error" align="center">Please log in to edit your profile.</Typography>;
    if (isLoading) return <Typography align="center">Loading...</Typography>;
    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 5, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Edit Profile
                    </Typography>
                    
                    {/* Profile Image Section */}
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <Avatar 
                            src={imagePreview || currentImage || "/default-avatar.png"} 
                            sx={{ width: 100, height: 100, mb: 2 }}
                            alt={formData.fullName}
                        />
                        <Box>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="profile-image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="profile-image-upload">
                                <Button
                                    variant="contained"
                                    component="span"
                                    size="small"
                                >
                                    Change Photo
                                </Button>
                            </label>
                        </Box>
                    </Box>
                    
                    <form onSubmit={handleSubmit}>
                        <TextField label="Full Name" name="fullName" fullWidth margin="normal" value={formData.fullName} onChange={handleChange} required />
                        <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} disabled />
                        <TextField label="Phone" name="phone" fullWidth margin="normal" value={formData.phone} onChange={handleChange} />
                        <TextField select label="Gender" name="gender" fullWidth margin="normal" value={formData.gender} onChange={handleChange}>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <TextField
                            type="date"
                            label="Date of Birth"
                            name="dateOfBirth"
                            fullWidth
                            margin="normal"
                            value={formData.dateOfBirth || ""}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField label="Location" name="location" fullWidth margin="normal" value={formData.location} onChange={handleChange} />
                        <TextField label="Bio" name="bio" fullWidth margin="normal" multiline rows={3} value={formData.bio} onChange={handleChange} />

                        {/* Skills Selection with Autocomplete */}
                        <Autocomplete
                            multiple
                            options={skillsList}
                            getOptionLabel={(option) => option.name}
                            value={formData.skills}
                            onChange={handleSkillChange}
                            renderInput={(params) => <TextField {...params} label="Skills" margin="normal" />}
                        />

                        <Box mt={3} display="flex" justifyContent="space-between">
                            <Button variant="contained" color="secondary" onClick={() => navigate("/profile")}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default ProfileEdit;