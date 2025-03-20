import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../assets/css/button.css';
import '../assets/css/img.css';
import '../assets/css/projectdetail.css';
import '../assets/css/schedule.css';
import '../assets/css/statusSchedule.css';
import '../assets/css/schedulestatus.css';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { deleteProject, approveVolunteerToProject, rejectVolunteerToProject } from "../hooks/projectService";
import { ProjectContext } from "../context/ProjectContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const localizer = momentLocalizer(moment);

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [editSchedule, setEditSchedule] = useState(null);
  const { user } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [participationStatus, setParticipationStatus] = useState(null);
  const [volunteersShow, setVolunteersShow] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false);
  const { volunteers, setVolunteers  } = useContext(ProjectContext);
  const volunteersList = volunteers[id] || [];
  useEffect(() => {
    // Fetch Project Details
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
      });

    // Fetch Schedules
    fetch(`http://localhost:3000/schedules/project/${id}`)
      .then((res) => res.json())
      .then((data) => setSchedules(data || []))
      .catch((err) => console.error("Error fetching schedules:", err));

    // Fetch Volunteers
    fetch(`http://localhost:3000/projects/${id}/volunteers?page=${currentPage}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVolunteersShow(data.data);
          setTotalVolunteers(data.total);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err) => console.error("Error fetching project volunteers:", err));

    // Fetch Participation Status (only source for participationStatus)
    if (user) {
      console.log("🔄 Fetching participation status for user:", user.email);
      fetch(`http://localhost:3000/projects/${id}/participation-status`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Participation Status Response:", data);
          setParticipationStatus(data.status || "Not Joined");
        })
        .catch((err) => {
          console.error("Error fetching participation status:", err);
          setParticipationStatus("Not Joined"); // Default if fetch fails
        });
    }
  }, [id, currentPage, user]);

  const handleJoinProject = () => {
    console.log("Joining project with ID:", id);
    console.log("User email:", user?.email);

    fetch(`http://localhost:3000/projects/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to join project");
        }
        return res.json();
      })
      .then(() => {
        alert("Join request sent. Waiting for approval.");
        setParticipationStatus("Pending");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      navigate(`/projects/organization/${project.data.organization._id}`);
    }
  };
  const handleShow = () => {
    setShow(true); 
  };

  const handleReject = async (volunteerId, projectId) => {
    try {
      await rejectVolunteerToProject(volunteerId, projectId);
      
      setVolunteers((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter((v) => v.volunteer._id !== volunteerId),
      }));
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (volunteerId, projectId) => {
    try {
      await approveVolunteerToProject(volunteerId, projectId);
      
      setVolunteers((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter((v) => v.volunteer._id !== volunteerId),
      }));

    } catch (error) {
      console.log(error);
    }
  };
  const handleCompleteSchedule = async (scheduleId) => {
    try {
      setEditSchedule(null);
      const updatedSchedules = schedules.map((schedule) =>
        schedule._id === scheduleId ? { ...schedule, status: "Completed" } : schedule
      );

      setSchedules(updatedSchedules); // Cập nhật trạng thái trên UI trước

      const response = await fetch(`http://localhost:3000/schedules/${scheduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete schedule");
      }

      alert("Schedule marked as Completed!");
    } catch (error) {
      console.error("Error completing schedule:", error);
      alert("Failed to update schedule.");
    }
  };
  const handleDeleteSchedule = async (scheduleId) => {
    setEditSchedule(null);
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      await fetch(`http://localhost:3000/schedules/${scheduleId}`, { method: "DELETE" });
      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
    }
  };

  const handleEditSchedule = (schedule) => {
    console.log(schedule);
    setEditSchedule(schedule);
  };

  const handleUpdateSchedule = async () => {
    if (!editSchedule) return;

    try {
      const response = await fetch(`http://localhost:3000/schedules/${editSchedule._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSchedule),
      });

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }

      const updatedSchedule = await response.json();
      setSchedules(schedules.map((s) => (s._id === updatedSchedule._id ? updatedSchedule : s)));
      setEditSchedule(null);
      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule.");
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!project) return <p>Loading...</p>;
  return (
    <div className="project-container">
      {/* Left column: Project information */}
      <div className="project-details">
        <h2 className="tieude">Tên dự án: {project.data.title}</h2>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "20%" }}>Mô tả dự án:</p>
          <p>{project.data.description}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Location: </p>
          <p>{project.data.location}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Category:</p>
          <p>{project.data.categories}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Status: </p>
          <p>{project.data.status}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Start Date:</p>
          <p>{project.data.startDate?.split("T")[0]}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>End Date:</p>
          <p>{project.data.endDate?.split("T")[0]}</p>
        </div>

        {/* Volunteers Section */}
        <div className="project-volunteers">
          <h3 className="tieude">Volunteers</h3>
          {user?.role === "Volunteer" ? (
            <p>Total Volunteers: {totalVolunteers}</p>
          ) : (
            <>
              {volunteers.length > 0 ? (
                <ul className="volunteers-list">
                  {volunteers.map((vol) => (
                    <li key={vol._id} className="volunteer-item">
                      <p className="volunteer-name">{vol.fullName || "Anonymous"}</p>
                      <p className="volunteer-email">{vol.email || "No email available"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No accepted volunteers yet.</p>
              )}

              {/* Pagination for volunteers */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`pag-btn ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    Previous
                  </button>
                  <span className="page-info">{`Page ${currentPage} of ${totalPages}`}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`pag-btn ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="button-group">
          {user?.role === "Organization" && user._id === project.data.organization.user ? (
            <>
              <button className="project-btn btn-edit" onClick={() => navigate(`/projects/${id}/edit`)}>✏️ Edit</button>
              <button className="project-btn btn-delete" onClick={handleDeleteProject}>🗑 Delete</button>
              <button className="project-btn btn-add" onClick={() => navigate(`/create-schedule/${id}`)}>➕ Thêm lịch trình</button>
            </>
          ) : user?.role === "Volunteer" ? (
            <button
              onClick={handleJoinProject}
              disabled={participationStatus === "Pending" || participationStatus === "Accepted" || participationStatus === "Rejected"}
              className={`project-btn ${participationStatus === "Accepted"
                ? "btn-accepted"
                : participationStatus === "Pending"
                  ? "btn-pending"
                  : participationStatus === "Rejected"
                    ? "btn-rejected"
                    : "btn-join"
                }`}
              style={{
                opacity: participationStatus === "Pending" || participationStatus === "Accepted" || participationStatus === "Rejected" ? 0.7 : 1,
                cursor: participationStatus === "Pending" || participationStatus === "Accepted" || participationStatus === "Rejected" ? "not-allowed" : "pointer",
              }}
            >
              {participationStatus === "Accepted"
                ? "Accepted"
                : participationStatus === "Pending"
                  ? "Pending Approval"
                  : participationStatus === "Rejected"
                    ? "Rejected"
                    : "✅ Join Project"}
            </button>
          ) : null}
        </div>

        <div className="project-image-container">
          {project.data.image ? (
            <img src={`http://localhost:3000${project.data.image}`} className="project-image" alt="Project" />
          ) : (
            <p>No image available</p>
          )}
        </div>
        {user?.role === "Organization" && user._id === project.data.organization.user ? (
          <div style={{marginTop: 20, display: 'grid'}}>
          <Button variant="warning" onClick={() => handleShow()} style={{padding: 20}}>
            Pending Volunteers
          </Button>

          <Modal
            show={show}
            onHide={() => setShow(false)}
            size="xl"
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                Pending Voluteers List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {volunteersList.length > 0 ? (
                  volunteersList.map((v) => (
                      <li key={project._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 key={v.volunteer._id} className="mb-1">Fullname: {v.volunteer.fullName}</h6>
                                <p key={`dob-${v.volunteer._id}`} className="mb-1">DOB: {new Date(v.volunteer.dateOfBirth).toLocaleDateString("vi-VN")}</p>
                                <p key={`email-${v.volunteer._id}`} className="mb-1">Gender: {v.volunteer.gender}</p>
                                <>
                                  Skills: 
                                  {v.volunteer.skills.map((skill) => (
                                    <li style={{fontSize: 14}} key={skill._id} className="mb-1">{skill.name}</li>
                                  ))}
                                </>
                            </div>

                            <div>
                              <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleReject(v.volunteer._id, v.project._id)}
                              >
                                  Reject
                              </button>

                              <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleApprove(v.volunteer._id, v.project._id)}
                                  style={{marginLeft: 15}}
                              >
                                  Approve
                              </button>
                            </div>
                        </li>
                  ))
              ) : (
                  <p>No pending volunteers.</p>
              )}
            </Modal.Body>
          </Modal>          
        </div>

          ) : null }
        
      </div>

      {/* Right column: Project schedules */}
      <div className="project-schedule">
        <h3>📅 Lịch trình dự án</h3>
        {schedules.length !== 0 ? (
          <ul>
            {schedules
              .slice() // Tạo một bản sao của mảng để tránh thay đổi trạng thái gốc
              .sort((a, b) => {
                if (a.status === "Completed" && b.status !== "Completed") return 1;
                if (a.status !== "Completed" && b.status === "Completed") return -1;
                return a.startTime.localeCompare(b.startTime);
              }) // Sắp xếp theo startTime
              .map((schedule) => (
                <li className={`schedule-item ${schedule.status.toLowerCase()}`} key={schedule._id}>
                  <strong>{schedule.date.split("T")[0]}</strong>: {schedule.startTime} - {schedule.endTime}
                  <p>{schedule.description}</p>
                  <p><strong>Trạng thái:</strong> {schedule.status}</p>

                  {user?.role === "Organization" && user._id === project.data.organization.user && (
                    <div className="schedule-actions">
                      <button className="project-btn btn-edit" onClick={() => handleEditSchedule(schedule)}>✏️ Edit</button>
                      <button className="project-btn btn-delete" onClick={() => handleDeleteSchedule(schedule._id)}>🗑 Delete</button>
                      {schedule.status !== "Completed" && (
                        <button className="project-btn btn-complete" onClick={() => handleCompleteSchedule(schedule._id)}>✅ Hoàn thành</button>
                      )}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p>Không có lịch trình nào.</p>
        )}
      </div>

      {/* Schedule edit form */}
      {editSchedule && (
        <div className="edit-schedule-form">
          <h3> Edit Schedule</h3>


          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={editSchedule.date.split("T")[0]}
              min={project?.data?.startDate?.split("T")[0]}
              max={project?.data?.endDate?.split("T")[0]}
              onChange={(e) => setEditSchedule({ ...editSchedule, date: e.target.value })}
            />
          </div>
          <div className="form-group"><label>Start Time:</label>
            <input
              type="time"
              value={editSchedule.startTime}
              onChange={(e) => setEditSchedule({ ...editSchedule, startTime: e.target.value })} /></div>
          <div className="form-group">
            <label>End Time:</label>
            <input
              type="time"
              value={editSchedule.endTime}
              onChange={(e) => {
                const newEndTime = e.target.value;
                if (newEndTime <= editSchedule.startTime) {
                  alert("End time must be greater than start time!");
                } else {
                  setEditSchedule({ ...editSchedule, endTime: newEndTime });
                }
              }} />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={editSchedule.description}
              onChange={(e) => setEditSchedule({ ...editSchedule, description: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={editSchedule.status}
              onChange={(e) => setEditSchedule({ ...editSchedule, status: e.target.value })}
              className={`status-select ${editSchedule.status.toLowerCase()}`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <div className="button-group">
              <button className="btn-save" onClick={handleUpdateSchedule}>Save</button>
              <button className="btn-cancel" onClick={() => setEditSchedule(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}