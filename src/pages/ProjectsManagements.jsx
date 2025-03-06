import React, { useEffect, useState } from 'react';
import { getAllProjects, approveProject } from '../hooks/projectService';
import { Button, Table } from 'react-bootstrap';
import '../assets/css/body.css';

export function ProjectsManagements() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadItem();
    }, []);

    const loadItem = async () => {
        try {
            const result = await getAllProjects();
            console.log('Dữ liệu nhận được từ API:', result.data); // Kiểm tra dữ liệu
            setItems(Array.isArray(result.data) ? result.data : []);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            setItems([]);
        }
    };
    
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("vi-VN", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Ho_Chi_Minh"
        });
    };

    const handleApprove = async (id) => {
            try {
                await approveProject(id);
    
                setItems(items.map(item => 
                    item._id === id ? { ...item, status: "Approved" } : item
                ));
            } catch (error) {
                console.error("Lỗi: ", error);
            }
        };

    return (
        <Table className="table text-nowrap table-borderless" style={{maxWidth: "100px"}}>
            <thead>
                <tr>
                    <th scope="col">Organization Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(items) && items.length > 0 ? (
                    items.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{item.title}</th>
                            <td className='des'>{item.description}</td>
                            <td>{formatDate(item.startDate)}</td>
                            <td>{formatDate(item.endDate)}</td>
                            <td><span className="badge bg-danger">{item.status}</span></td>
                            <td>
                                <Button 
                                    variant="success" 
                                    size="sm" 
                                    onClick={() => handleApprove(item._id)}
                                >
                                    {item.status === "Approved" ? "" : "Approve"}
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">Không có dữ liệu</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}