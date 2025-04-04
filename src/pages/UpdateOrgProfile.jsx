import Swal from 'sweetalert2';
import { useState, useEffect, useContext } from 'react';
import { editOrg } from '../hooks/organizationService';

import { organizationProfile } from "../hooks/profileHook";

export function UpdateOrgProfile() {
    // Get organization data from context
    const { organization, refreshOrgData } = organizationProfile();
    const provinces = [
        "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu",
        "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương",
        "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
        "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
        "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
        "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình",
        "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh",
        "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
        "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc",
        "Yên Bái"
    ];
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch current organization data from the context
    useEffect(() => {
        if (organization && organization.organization) {
            const orgData = organization.organization;
            
            setFormData({
                name: orgData.name || '',
                description: orgData.description || '',
                address: orgData.address || '',
                phone: orgData.phone || ''
            });
            
            setIsLoading(false);
        } else {
            // Try to refresh the data if not available
            refreshOrgData();
        }
    }, [organization, refreshOrgData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create FormData object to send both text fields and file
            const formDataToSend = new FormData();
            
            // Append text fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            
            // Append file if exists
            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }
            
            const response = await editOrg(formDataToSend);
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            });
            
            // Refresh organization data after successful update
            refreshOrgData();
            
            // Reset image preview and profile image state
            setImagePreview(null);
            setProfileImage(null);
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Error updating organization'
            });
        }
    };

    if (isLoading || !organization || !organization.organization) {
        return <div className="text-center py-5">Loading organization data...</div>;
    }

    // Get the current profile image from context
    const currentProfileImage = organization.organization.org_profile;

    return (
        <section className="section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <form className="form checkout-form" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="row">
                                <div className="col-lg-7 col-xl-8">
                                    <div className="form__fieldset">
                                        <h6 className="form__title">Organization Details</h6>
                                        <div className="row offset-30">
                                            <div className="col-12 mb-4">
                                                <div className="profile-image-upload">
                                                    {(imagePreview || currentProfileImage) && (
                                                        <div className="image-preview mb-3">
                                                            <img 
                                                                src={imagePreview || currentProfileImage} 
                                                                alt="Profile Preview" 
                                                                style={{ 
                                                                    maxWidth: '200px', 
                                                                    maxHeight: '200px',
                                                                    borderRadius: '8px' 
                                                                }} 
                                                            />
                                                        </div>
                                                    )}
                                                    <label htmlFor="profileImage" className="form__label">Organization Logo/Profile Image</label>
                                                    <input 
                                                        type="file" 
                                                        id="profileImage"
                                                        name="profileImage"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="form__field form__field--file"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <input className="form__field" type="text" name="name" placeholder="Organization Name *" onChange={handleChange} value={formData.name} required />
                                            </div>
                                          
                                            <div className="col-12">
                                                <textarea className="form__field form__message" name="description" placeholder="Description" onChange={handleChange} value={formData.description}></textarea>
                                            </div>
                                            <div className="col-12">
                                                <select className="form__field" name="address" value={formData.address} onChange={handleChange} required>
                                                    <option value="">Chọn tỉnh/thành phố</option>
                                                    {provinces.map((province, index) => (
                                                        <option key={index} value={province}>
                                                            {province}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-lg-6">
                                                <input className="form__field" type="text" name="phone" placeholder="Phone *" onChange={handleChange} value={formData.phone} required />
                                            </div>
                                        </div>
                                    </div>
                                    <button className="form__submit" type="submit">Update Profile</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}