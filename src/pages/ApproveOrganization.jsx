import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllOrgPending, approveOrgw } from '../hooks/organizationService';
import { Table, Button } from "react-bootstrap";

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
        try {
            await approveOrgw(orgId); // Gửi yêu cầu duyệt lên server
    
            // Cập nhật lại state với tổ chức đã duyệt
            setOrgs(prevOrgs =>
                prevOrgs.map(org =>
                    org._id === orgId ? { ...org, status: "Approved" } : org
                )
            );
    
            console.log(`Tổ chức có ID ${orgId} đã được duyệt.`);
        } catch (error) {
            console.error("Lỗi khi duyệt tổ chức:", error);
        }
    };
    
    return (
        <Table className="table text-nowrap table-borderless">
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
                                <Button 
                                    variant="success" 
                                    size="sm" 
                                    onClick={() => handleApprove(org._id)}
                                >
                                    Approve
                                </Button>
                            )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center">Không có dữ liệu</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}