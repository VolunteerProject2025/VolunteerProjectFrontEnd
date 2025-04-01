import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../hooks/userService'
import { Button, Table } from "react-bootstrap";
import { inActiveUser, activeUser } from '../hooks/userService';

export function UsersManagement() {
    const [users, setUsers] = useState([]);

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
                                                    <th scope="row" style={{cursor: 'pointer'}}
                                                        onClick={() => {
                                                            if (window.getSelection().toString()) return;
                                                            alert(user.fullName);}
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
                                                                // onClick={() => handleShow(org._id)}
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
        </>
    );
}