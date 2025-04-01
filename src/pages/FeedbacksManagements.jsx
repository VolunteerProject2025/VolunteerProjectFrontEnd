import React, { useEffect, useState } from 'react';
import { getAllFeedbacks } from '../hooks/feedbacksService';
import '../assets/css/body.css';

export function FeedbacksManagements() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadItem();
    }, []);

    const loadItem = async () => {
        try {
            const result = await getAllFeedbacks();
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

    return (
        <>
            <div className="row mt-3">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Feedbacks List</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Fullname</th>
                                            <th scope="col">Project</th>
                                            <th scope="col">Organization</th>
                                            <th scope="col">Content</th>
                                            <th scope="col">Rating</th>
                                            <th scope="col">Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(items) && items.length > 0 ? (
                                            items.map((item, index) => (
                                                <tr key={index}>
                                                    <th>{item.user ? item.user.fullName : "N/A"}</th>
                                                    <th>{item.project.title}</th>
                                                    <th>{item.organization ? item.organization.name : "N?A"}</th>
                                                    <td className='des'>{item.content}</td>
                                                    <td>{item.rating}</td>
                                                    <td>{formatDate(item.createdAt)}</td>
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