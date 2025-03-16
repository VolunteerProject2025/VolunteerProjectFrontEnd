import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../hooks/userService'
import { Table } from "react-bootstrap";

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
                            {/* <td><span className="badge bg-primary">{user.status}</span></td> */}
                        </tr>
                    ))}

                </tbody>
            </Table>
        </>
    );
}
