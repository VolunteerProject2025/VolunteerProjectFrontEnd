import React, { useEffect, useState } from 'react';
import { getAllOrgPending, approveOrgw } from '../hooks/organizationService';

export function ApproveOrganization() {
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        loadOrg();
    }, []);

    const loadOrg = async () => {
        try {
            const result = await getAllOrgPending();
            console.log("Dữ liệu từ API:", result);
            setOrgs(Array.isArray(result.data) ? result.data : []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setOrgs([]);
        }
    };

    const handleApprove = async (orgId) => {
        const isConfirmed = window.confirm("Are you sure you want to approve this organization?");
        if (!isConfirmed) return;

        try {
            await approveOrgw(orgId); // Gửi yêu cầu duyệt lên server

            setOrgs(prevOrgs => prevOrgs.filter(org => org._id !== orgId));

            console.log(`Tổ chức có ID ${orgId} đã được duyệt.`);
        } catch (error) {
            console.error("Lỗi khi duyệt tổ chức:", error);
        }
    };

    return (
        <>
            <div className="row mt-3">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Pending Organizations</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Organization Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orgs.length > 0 ? (
                                            orgs.map((org, index) => (
                                                <tr key={org._id || index}>
                                                    <th scope="row">{org.name || "N/A"}</th>
                                                    <td className='des'>{org.description || "N/A"}</td>
                                                    <td>{org.contactEmail || "N/A"}</td>
                                                    <td>{org.address || "N/A"}</td>
                                                    <td>{org.phone || "N/A"}</td>

                                                    <td>
                                                        {org.status !== "Approved" && (
                                                            <div style={{marginTop: -8, marginLeft: 18}}>
                                                                <i style={{ fontSize: 26, cursor: "pointer" }}
                                                                    className="bi bi-check-circle"
                                                                    onClick={() => handleApprove(org._id)}
                                                                    title='Approve Organization'
                                                                />
                                                            </div>
                                                        )}
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