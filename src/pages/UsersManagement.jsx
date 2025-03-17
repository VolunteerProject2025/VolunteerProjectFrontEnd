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
    
    const handleApprove = async (id) => {
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
            <Table className="table text-nowrap table-borderless">
                <thead>
                    <tr>
                        <th scope="col">FullName</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Status</th>
                        <th scope="col">isVerified</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr>
                            <th scope="row">{user.fullName}</th>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>{user.is_verified ? <span className="badge bg-success">Verified</span> : <span className="badge bg-danger">Not Verified</span>}</td>
                            <td>
                                {user.status === "Active" ? <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => handleApprove(user._id)}
                                >
                                    InActive
                                </Button> : <Button 
                                    variant="success" 
                                    size="sm" 
                                    onClick={() => handleActive(user._id)}
                                >
                                    Active
                                </Button> }
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </>
    );
}