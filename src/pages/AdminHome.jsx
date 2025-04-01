import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../hooks/feedbacksService';
import { getPendingProjects } from '../hooks/projectService';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export function AdminHome() {
    const [items, setItems] = useState({ projects: {}, organizations: {}, users: {}, posts: {} });
    const [showMore, setShowMore] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const result = await getAdminDashboard();
            // console.log("Dữ liệu từ API:", result.data);
            setItems(result.data);

            const projects = await getPendingProjects();
            console.log('Dữ liệu nhận được từ API:', projects.data);
            setProjects(Array.isArray(projects.data) ? projects.data : []);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
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

    const data = {
        labels: ["Pending Project", "Approved Project", "Rejected Project", "Completed Project"],
        datasets: [
            {
                data: [items.projects.pending, items.projects.approved, items.projects.rejected, items.projects.completed], 
                backgroundColor: ["#FFFF00", "#28a745", "#dc3545", "#17a2b8"],
                hoverBackgroundColor: ["#FFFF00", "#218838", "#c82333", "#138496"],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    return (
        <>
            {items ? (
                <div>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white mr-2">
                                <i className="mdi mdi-home"></i>
                            </span> Dashboard </h3>
                        <nav aria-label="breadcrumb">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item active" aria-current="page">
                                    <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="row">
                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <h4 className="font-weight-normal mb-2">Total Projects<i style={{ fontSize: 26 }} className="bi bi-calendar2-event ml-3"></i></h4>
                                    <h2 className="mb-2 ml-2">{items.projects.total}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <h4 className="font-weight-normal mb-2">Total Organizations<i style={{ fontSize: 26 }} className="bi bi-buildings ml-3"></i></h4>
                                    <h2 className="mb-2 ml-2">{items.organizations.total}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <h4 className="font-weight-normal mb-2">Total Users<i style={{ fontSize: 26 }} className="bi bi-person-circle ml-3"></i></h4>
                                    <h2 className="mb-2 ml-2">{items.users.total}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <h4 className="font-weight-normal mb-2">Total Posts<i style={{ fontSize: 26 }} className="bi bi-pencil-square ml-3"></i></h4>
                                    <h2 className="mb-2 ml-2">{items.posts.total}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <h4 className="font-weight-normal mb-2">Total Volunteers
                                        <i style={{ fontSize: 26 }} className="bi bi-person-hearts ml-3"></i></h4>
                                    <h2 className="mb-2 ml-2">{items.users.volunteers}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <h4 className="font-weight-normal mb-2">Pending Projects<i style={{ fontSize: 26 }} className="bi bi-calendar2-event ml-3"></i></h4>
                                    <h2 className="mb-2 ml-2">{items.projects.pending}</h2>
                                </div>
                            </div>
                        </div>

                        {showMore && (
                            <>
                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Completed Projects<i style={{ fontSize: 26 }} className="bi bi-calendar2-event ml-3"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.projects.completed}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Approved Projects<i style={{ fontSize: 26 }} className="bi bi-calendar2-event ml-3"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.projects.approved}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Rejected Projects<i style={{ fontSize: 26 }} className="bi bi-calendar2-event ml-3"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.projects.rejected}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Pending Organizations<i style={{ fontSize: 26 }} className="bi bi-buildings ml-3"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.organizations.pending}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Approved Organizations</h4>
                                            <h2 className="mb-2 ml-2">{items.organizations.approved}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Rejected Organizations<i style={{ fontSize: 26 }} className="bi bi-buildings ml-2"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.organizations.rejected}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">Active User<i style={{ fontSize: 26 }} className="bi bi-person-fill-check ml-3"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.users.active}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 stretch-card grid-margin mt-3 mb-3">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <div className="card-body">
                                            <h4 className="font-weight-normal mb-2">InActive User<i style={{ fontSize: 26 }} className="bi bi-person-fill-slash ml-3"></i></h4>
                                            <h2 className="mb-2 ml-2">{items.users.inactive}</h2>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="col-12 text-center mb-3">
                            <button onClick={() => setShowMore(!showMore)} className="btn btn-dark">
                                {showMore ? "Hide" : "Show More"} <i className={`bi ${showMore ? "bi-chevron-up" : "bi-chevron-down"} ml-2`}></i>
                            </button>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-7 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Pending Project</h4>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th> # </th>
                                                    <th> Project Name </th>
                                                    <th> Description </th>
                                                    <th> Start Date </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(projects) && projects.length > 0 ? (
                                                        projects.map((project, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <th scope="row">{project.title}</th>
                                                                <td className='des'>{project.description}</td>
                                                                <td>{formatDate(project.startDate)}</td>
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

                        <div className="col-md-5 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Projects Managements</h4>
                                    <div className='mt-3 mb-3' style={{ width: "400px", height: "400px" }}>
                                        <Doughnut data={data} options={options} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            ) : (
                <tr>
                    <td colSpan="7" className="text-center">Không có dữ liệu</td>
                </tr>
            )}
        </>
    );
}
