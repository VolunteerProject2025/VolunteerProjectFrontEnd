import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../assets/css/completedProjects.css';
const API_URL = `${import.meta.env.VITE_API_URL}/projects`;
const FEEDBACK_URL = `${import.meta.env.VITE_API_URL}/feedbacks`;

export function CompletedProjects ()  {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [projectsPerPage] = useState(6);
    const navigate = useNavigate();
    
    // Feedback Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [feedback, setFeedback] = useState({
        content: '',
        rating: 5
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCompletedProjects();
    }, []);

    const fetchCompletedProjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/completed-projects`, {
                withCredentials: true,
            });
            console.log(response.data.data);
            
            if (response.data.success) {
                setProjects(response.data.data);
            } else {
                setError('Failed to fetch completed projects');
            }
        } catch (err) {
            console.error('Error fetching completed projects:', err);
            setError(err.response?.data?.message || err.message || 'Something went wrong');
            toast.error(err.response?.data?.message || 'Failed to load completed projects');
        } 
    };

    // Handle opening the feedback modal
    const handleOpenFeedbackModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    // Handle closing the feedback modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProject(null);
        setFeedback({ content: '', rating: 5 });
    };

    // Handle feedback input changes
    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedback({
            ...feedback,
            [name]: name === 'rating' ? parseInt(value) : value
        });
    };

    // Handle navigation to certificate page
    const navigateToCertificate = (project) => {
        console.log('Name',project.volunteerFullName);
        
        // Navigate to Certificate page with project and user information
        navigate('/certificate', { 
            state: { 
                project: project,
                projectTitle: project.title,
                organizationName: project.organization?.name || "Volunteer Organization",
                completionDate: formatDate(project.endDate),
                 volunteerName: project.volunteerFullName || ""
            } 
        });
    };

    // Handle feedback submission
    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        
        if (!feedback.content.trim()) {
            toast.error('Please provide feedback content');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(FEEDBACK_URL, {
                project: selectedProject._id,
                organization: selectedProject.organization,
                content: feedback.content,
                rating: feedback.rating
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success('Feedback submitted successfully');
                handleCloseModal();
                // Optionally refresh projects to show updated feedback status
                fetchCompletedProjects();
            } else {
                toast.error(response.data.message || 'Failed to submit feedback');
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
            toast.error(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Pagination logic
    const pageCount = Math.ceil(projects.length / projectsPerPage);
    const offset = currentPage * projectsPerPage;
    const currentProjects = projects.slice(offset, offset + projectsPerPage);

    // Handle page change
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    // Format date to readable string
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return (
            <div className="error-container">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="completed-projects-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="completed-projects-header">
                            <h2 className="text-center mb-4">My Completed Projects</h2>
                            <p className="text-center text-muted mb-5">
                                Here are all the projects you've successfully completed as a volunteer.
                            </p>
                        </div>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="no-projects-container text-center">
                        <div className="empty-state">
                            <i className="fas fa-clipboard-check empty-icon"></i>
                            <h3>No Completed Projects Yet</h3>
                            <p>You haven't completed any projects yet. Join some projects and complete them to see them listed here.</p>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={() => navigate('/')}
                            >
                                Browse Available Projects
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {currentProjects.map((project) => (
                                <div key={project._id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="completed-project-card">
                                        <div className="completed-badge">
                                            <span>Completed</span>
                                        </div>
                                        <div className="project-img-container">
                                            <img 
                                                src={`http://localhost:3000${project.image}`} 
                                                alt={project.title} 
                                                className="project-img"
                                            />
                                            <div className="project-category">
                                                {project.categories || "General"}
                                            </div>
                                        </div>
                                        <div className="project-info">
                                            <h3 className="project-title">{project.title}</h3>
                                            <p className="project-description">{project.description}</p>
                                            <div className="project-details">
                                                <div className="detail">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    <span>{project.location}</span>
                                                </div>
                                                <div className="detail">
                                                    <i className="fas fa-calendar-check"></i>
                                                    <span>{formatDate(project.endDate)}</span>
                                                </div>
                                            </div>
                                            <div className="project-actions d-flex">
                                                <button 
                                                    className="btn btn-view-details me-2" 
                                                    onClick={() => handleOpenFeedbackModal(project)}
                                                >
                                                    <i className="fas fa-comment-dots me-1"></i> Feedback
                                                </button>
                                                <button 
                                                    className="btn btn-certificate" 
                                                    onClick={() => navigateToCertificate(project)}
                                                >
                                                    <i className="fas fa-certificate me-1"></i> Certificate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {projects.length > projectsPerPage && (
                            <div className="pagination-container mt-4 mb-5">
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination justify-content-center"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={"page-link"}
                                    breakClassName={"page-item"}
                                    breakLinkClassName={"page-link"}
                                    activeClassName={"active"}
                                    disabledClassName={"disabled"}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Feedback Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Project Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProject && (
                        <Form onSubmit={handleSubmitFeedback}>
                            <Form.Group className="mb-3">
                                <Form.Label>Project</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={selectedProject.title} 
                                    disabled 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rating</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Range
                                        name="rating"
                                        min="1"
                                        max="5"
                                        step="1"
                                        value={feedback.rating}
                                        onChange={handleFeedbackChange}
                                    />
                                    <span className="ms-2 fw-bold">{feedback.rating}/5</span>
                                </div>
                                <div className="text-center mt-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <i 
                                            key={star}
                                            className={`fas fa-star ${star <= feedback.rating ? 'text-warning' : 'text-muted'}`}
                                            style={{ cursor: 'pointer', fontSize: '1.5rem', margin: '0 5px' }}
                                            onClick={() => setFeedback({...feedback, rating: star})}
                                        ></i>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Your Feedback</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="content"
                                    rows={4}
                                    placeholder="Share your experience with this project..."
                                    value={feedback.content}
                                    onChange={handleFeedbackChange}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmitFeedback}
                        disabled={isSubmitting || !feedback.content.trim()}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};