import React from "react";
import { useProfile } from "../hooks/profileHook";
import imgProfile from "../assets/img/user_img.png";
import { Link } from "react-router-dom";
import {
    Container, Card, Avatar, Typography, Grid, Button, Chip, Divider, Box
} from "@mui/material";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaTransgender } from "react-icons/fa";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function Profile() {
    const { isAuthenticated, isLoading, error, userProfile } = useProfile();

    if (!isAuthenticated) return <Typography color="error" align="center">Please log in to view your profile.</Typography>;
    if (isLoading) return <Typography align="center">Loading your profile...</Typography>;
    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 3 }}>
                {/* Avatar + Name */}
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                        src={userProfile?.img_profile || imgProfile}
                        sx={{ width: 100, height: 100, border: "4px solid #3f51b5" }}
                    />
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
                        {userProfile?.fullName || "Anonymous"}
                    </Typography>
                    <Typography color="text.secondary">
                        {userProfile?.bio || "No bio available yet."}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Profile Details */}
                <Grid container spacing={3}>
                    <ProfileField icon={<FaUser />} label="Full Name" value={userProfile?.fullName} />
                    <ProfileField icon={<FaEnvelope />} label="Email" value={userProfile?.email} />
                    <ProfileField icon={<FaPhone />} label="Phone" value={userProfile?.phone || "No phone number"} />
                    <ProfileField icon={<FaTransgender />} label="Gender" value={userProfile?.gender || "Not specified"} />
                    <ProfileField 
                        icon={<FaBirthdayCake />} 
                        label="Date of Birth" 
                        value={
                            userProfile?.dateOfBirth 
                                ? format(new Date(userProfile.dateOfBirth), "dd/MM/yyyy", { locale: vi }) 
                                : "N/A"
                        } 
                    />
                    <ProfileField icon={<FaMapMarkerAlt />} label="Location" value={userProfile?.location || "Not provided"} />
                </Grid>

                {/* Skills Section */}
                <Box mt={4}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Skills</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {userProfile?.skills?.length > 0 ? (
                            userProfile.skills.map((skill, index) => (
                                <Chip key={index} label={skill.name} color="primary" />
                            ))
                        ) : (
                            <Typography color="text.secondary">No skills listed yet.</Typography>
                        )}
                    </Box>
                </Box>

                {/* Buttons */}
                <Box mt={4} display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="contained"
                        color="warning"
                        component={Link}
                        to="/edit-profile"
                    >
                        Edit Profile
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/change-password"
                    >
                        Change Password
                    </Button>
                </Box>
            </Card>
        </Container>
    );
}

// ProfileField Component
const ProfileField = ({ icon, label, value }) => (
    <Grid item xs={12} sm={6}>
        <Box display="flex" alignItems="center" gap={2} sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Box color="primary.main">{icon}</Box>
            <Box>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography>{value}</Typography>
            </Box>
        </Box>
    </Grid>
);

export default Profile;