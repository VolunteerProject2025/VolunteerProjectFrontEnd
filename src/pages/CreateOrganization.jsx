import Swal from 'sweetalert2';
import { useContext, useState } from 'react';
import { createOrg } from '../hooks/organizationService';
import { AuthContext } from '../context/AuthContext';


export function CreateOrganization() {
    const { refreshData } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
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

            const response = await createOrg(formDataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            });

            // Refresh data in the context after successful creation
            refreshData();

            // Reset form after successful submission
            setFormData({
                name: '',
                description: '',
                address: '',
                phone: ''
            });
            setProfileImage(null);
            setImagePreview(null);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message
            });
        }
    };

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
                                                    {imagePreview && (
                                                        <div className="image-preview mb-3">
                                                            <img
                                                                src={imagePreview}
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
                                    <button className="form__submit" type="submit">Create Organization</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}