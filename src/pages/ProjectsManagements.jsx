import React, { useEffect, useState } from 'react';
import { getAllProjects, getDetailProject } from '../hooks/projectService';
import Modal from 'react-bootstrap/Modal';
import '../assets/css/body.css';
 
export function ProjectsManagements() {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [projects, setProjects] = useState({});

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

    const handleDetailProject = async (id) => {
        try {
            const projects = await getDetailProject(id);
            console.log(projects.data.data);

            if (projects) {
                setProjects(projects.data.data);
            } else {
                setProjects({});
            }

        } catch (error) {
            console.error("Lỗi roi: ", error);
        }
    };

    const handleShow = async (id) => {
        await handleDetailProject(id);

        setShow(true);
    };

    return (
        <>
            <div className="row mt-3">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">List of Projects</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Project Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(items) && items.length > 0 ? (
                                            items.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{item.title}</th>
                                                    <td className='des' style={{ maxWidth: 400 }}>{item.description}</td>
                                                    <td>{formatDate(item.startDate)}</td>
                                                    <td>{formatDate(item.endDate)}</td>
                                                    <td style={{textAlign: 'center'}}>
                                                        <span
                                                            style={{
                                                                padding: "4px 8px",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                color: '#000',
                                                                background: item.status === 'Approved' ? "#28a745" : item.status === 'Pending' ? "#ffc107" : "#dc3545",
                                                                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
                                                                display: "inline-block",
                                                                textTransform: "capitalize",
                                                            }}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div style={{ marginTop: -6 }}>
                                                            <i style={{ fontSize: 26, cursor: "pointer" }}
                                                                className="bi bi-text-indent-right"
                                                                onClick={() => handleShow(item._id)}
                                                                title='View Project Details'
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
                        Project Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    maxHeight: "100vh",
                    overflowY: "auto",
                    padding: "20px",
                    borderRadius: "10px"
                }}>
                    {projects ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                {projects.image ? (
                                    <img
                                        src={`http://localhost:3000${projects.image}`}
                                        alt="Project"
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
                                {projects.title || "Loading ..."}
                            </h2>

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
                                    { label: "Project Description", value: projects.description },
                                    { label: "Location", value: projects.location },
                                    { label: "Category", value: projects.categories },
                                    { label: "Status", value: projects.status },
                                    { label: "Start Date", value: projects.startDate?.split("T")[0] },
                                    { label: "End Date", value: projects.endDate?.split("T")[0] }
                                ].map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '5px 0',
                                        borderBottom: index !== 5 ? '1px solid #ddd' : 'none'
                                    }}>
                                        <strong style={{ color: '#555' }}>{item.label}:</strong>
                                        <span style={{maxWidth: 500}}>{item.value || "Loading ..."}</span>
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