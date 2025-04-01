import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { getAllOrg } from '../hooks/organizationService';
import { getDetailUserById } from '../hooks/userService';

export function OrganizationsManagement() {
    const [orgs, setOrgs] = useState([]);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        loadOrg();
    }, []);

    const loadOrg = async () => {
        const result = await getAllOrg();
        setOrgs(result.data);
        console.log(result);
        
    };

    const handleGetUser = async (id, role) => {
        try {
            const user = await getDetailUserById(id, role);
            console.log(user);
            console.log(role);

            if (user) {
                setUser(user.data.data ? user.data.data : user.data);
            } else {
                setUser({});
            }

        } catch (error) {
            console.error("Lỗi: ", error);
        }
    }

    const handleShow = async (id, role) => {
        await handleGetUser(id, role);

        setShow(true);
    };

    return (
        <>
            <div className="row mt-3">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Organizations List</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Organization Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(orgs) && orgs.length > 0 ? (
                                            orgs.map((org, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{org.name}</th>
                                                    <td className='des'>{org.description}</td>
                                                    <td>{org.contactEmail}</td>
                                                    <td>{org.address}</td>
                                                    <td>{org.phone}</td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                padding: "4px 8px",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                color: "#fff",
                                                                backgroundColor: org.status === "Approved" ? "#28a745" : "#dc3545",
                                                                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
                                                                display: "inline-block",
                                                                textTransform: "capitalize",
                                                            }}
                                                        >
                                                            {org.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div style={{ marginTop: -6 }}>
                                                            <i style={{ fontSize: 26, cursor: "pointer" }}
                                                                className="bi bi-text-indent-right"
                                                                onClick={() => handleShow(org.user, 'Organization')}
                                                                title='View Organization Details'
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">Không có dữ liệu</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="xl"
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Organization Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    maxHeight: "100vh",
                    overflowY: "auto",
                    padding: "20px",
                    borderRadius: "10px"
                }}>
                    {user ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                {user?.volunteer?.user?.img_profile || user?.organization?.org_profile ? (
                                    <img
                                        src={user?.volunteer?.user?.img_profile || user?.organization?.org_profile}
                                        alt="UserPhoto"
                                        style={{
                                            maxWidth: '38%',
                                            height: 'auto',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                        }}
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>

                            <h2 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                                {user?.volunteer?.fullName || user?.organization?.name || "Loading ..."}
                            </h2>

                            {user?.organization && <h5 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                                {user?.organization?.description || "Loading ..."}
                            </h5>}

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background: '#f8f9fa',
                                padding: '15px',
                                borderRadius: '8px',
                                maxWidth: '800px',
                                margin: 'auto',
                                fontSize: '18px',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                                {[
                                    user?.organization && { label: "Representative", value: user?.organization?.user.fullName },
                                    { label: "Email", value: user?.volunteer?.email || user?.organization?.user.email },
                                    user?.volunteer && { label: "Skills", value: user.volunteer.skills.name },
                                    user?.volunteer && { label: "DateOfBirth", value: user?.volunteer?.dateOfBirth?.split("T")[0] },
                                    user?.volunteer && { label: "Gender", value: user?.volunteer?.gender },
                                    { label: "Location", value: user?.volunteer?.location || user?.organization?.address },
                                    { label: "Phone", value: user?.volunteer?.phone || user?.organization?.phone }
                                ].filter(Boolean)
                                    .map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '5px 0',
                                            borderBottom: index !== 5 ? '1px solid #ddd' : 'none'
                                        }}>
                                            <strong style={{ color: '#555' }}>{item.label}:</strong>
                                            <span style={{ maxWidth: 500 }}>{item.value || "Loading ..."}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Loading data...</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}
