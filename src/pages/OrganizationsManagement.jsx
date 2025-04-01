import React, { useEffect, useState } from 'react';
import { getAllOrg } from '../hooks/organizationService'

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
                                                                // onClick={() => handleShow(org._id)}
                                                                title='View Project Details'
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
        </>
    );
}
