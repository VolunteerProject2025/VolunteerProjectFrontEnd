import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../hooks/userService'
import Modal from 'react-bootstrap/Modal';
import { inActiveUser, activeUser, getDetailUserById } from '../hooks/userService';

export function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        loaduser();
    }, []);

    const loaduser = async () => {
        const result = await getAllUsers();
        setUsers(result.data);
    };

    console.log(users);

    const handleInActive = async (id) => {
        try {
            await inActiveUser(id);

            setUsers(users.map(user =>
                user._id === id ? { ...user, status: "Inactive" } : user
            ));
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const handleActive = async (id) => {
        try {
            await activeUser(id);

            setUsers(users.map(user =>
                user._id === id ? { ...user, status: "Active" } : user
            ));
        } catch (error) {
            console.error("Lỗi: ", error);
        }
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
                            <h4 className="card-title">List of Users</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">FullName</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Verification</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={index}>
                                                    <th scope="row" style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.getSelection().toString()) return;
                                                            alert(user._id);
                                                        }
                                                        }>{user.fullName}</th>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>{user.status}</td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                padding: "4px 8px",
                                                                marginLeft: 12,
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                // color: "#fff",
                                                                color: user.is_verified ? "#28a745" : "#dc3545",
                                                                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
                                                                display: "inline-block",
                                                                textTransform: "capitalize",
                                                            }}
                                                        >
                                                            {user.is_verified ? 'Verified' : 'Not Verified'}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {user.status === "Active" ?
                                                            <div style={{ marginLeft: 10 }}>
                                                                <i style={{ fontSize: 22, cursor: "pointer", color: 'white', background: '#dc3545', borderRadius: 50, paddingRight: 5, paddingLeft: 5, paddingTop: 1 }}
                                                                    className="bi bi-exclamation-circle"
                                                                    onClick={() => handleInActive(user._id)}
                                                                    title='Inactive User'
                                                                />
                                                            </div>
                                                            :
                                                            <div style={{ marginLeft: 10 }}>
                                                                <i style={{ fontSize: 22, cursor: "pointer", color: 'white', background: '#28a745', borderRadius: 50, paddingRight: 5, paddingLeft: 5, paddingTop: 1 }}
                                                                    className="bi bi-check-circle"
                                                                    onClick={() => handleActive(user._id)}
                                                                    title='Active User'
                                                                />
                                                            </div>
                                                        }
                                                    </td>

                                                    <td>
                                                        <div style={{ marginTop: -4 }}>
                                                            <i style={{ fontSize: 26, cursor: "pointer" }}
                                                                className="bi bi-text-indent-right"
                                                                onClick={() => handleShow(user._id, user.role)}
                                                                title='View Details'
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">Empty</td>
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
                        User Details
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