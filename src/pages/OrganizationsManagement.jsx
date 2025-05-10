import React, { useEffect, useState } from 'react';
import { getAllOrg } from '../hooks/organizationService'
import { Table } from "react-bootstrap";

export function OrganizationsManagement() {
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        loadOrg();
    }, []);

    const loadOrg = async () => {
        const result = await getAllOrg();
        setOrgs(result.data);
    };

    console.log(orgs);
    

    return (
        <>
            <Table className="table text-nowrap table-borderless" >
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
                    {orgs.map(org => (
                        <tr>
                            <th scope="row">{org.name}</th>
                            <td  className='des'>{org.description}</td>
                            <td>{org.contactEmail}</td>
                            <td>{org.address}</td>
                            <td>{org.phone}</td>
                            <td><span className="badge bg-primary">{org.status}</span></td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </>
    );
}
