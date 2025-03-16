import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    Container, TextField, Button, Card, CardContent, Typography, MenuItem, Box, Chip, Autocomplete
} from "@mui/material";
import { useProfile } from "../hooks/profileHook";
import { AuthContext } from "../context/AuthContext";
import { format, parseISO } from "date-fns";

export function ProfileEdit() {
    const { isAuthenticated, isLoading, error, userProfile } = useProfile();
    const { updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    //State lưu dữ liệu form
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

    const [skillsList, setSkillsList] = useState([]);

    //Fetch danh sách kỹ năng từ backend khi component mount
    useEffect(() => {
        fetch("http://localhost:3000/skills")
            .then(res => res.json())
            .then(data => setSkillsList(data))
            .catch(err => console.error("❌ Error fetching skills:", err));
    }, []);

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
        }
    }, [userProfile]);

    // Xử lý thay đổi trong form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý thay đổi danh sách kỹ năng
    const handleSkillChange = (event, newValue) => {
        setFormData({ ...formData, skills: newValue });
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/volunteers/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    dateOfBirth: formData.dateOfBirth ? format(parseISO(formData.dateOfBirth), "yyyy-MM-dd") : "",
                }),
                credentials: "include",
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile.");
            }
    
            const updatedProfile = await response.json();
            updateUser({ fullName: updatedProfile.volunteer.fullName });
    
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
                            value={formData.dateOfBirth ? format(parseISO(formData.dateOfBirth), "yyyy-MM-dd") : ""}
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
