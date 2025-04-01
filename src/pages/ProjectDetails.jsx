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
import { Tabs, Tab } from 'react-bootstrap';

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
  const { volunteers, setVolunteers } = useContext(ProjectContext);
  const volunteersList = volunteers[id] || [];

  // New states for join project modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  // New state for active tab
  const [activeTab, setActiveTab] = useState('details');

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

  // Modified to open the modal instead of directly joining
  const handleJoinClick = () => {
    setShowJoinModal(true);
  };

  // New function to handle actual join project submission
  const handleSubmitJoinRequest = () => {
    console.log("Joining project with ID:", id);
    console.log("User email:", user?.email);
    console.log("Join message:", joinMessage);

    fetch(`http://localhost:3000/projects/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: joinMessage }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to join project");
        }
        return res.json();
      })
      .then(() => {
        setShowJoinModal(false);
        alert("Join request sent. Waiting for approval.");
        setParticipationStatus("Pending");
      })
      .catch((error) => {
        setShowJoinModal(false);
        alert(error.message);
      });
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      navigate(`/projects/organization/${project.data.organization._id}`);
    }
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

      setSchedules(updatedSchedules);

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
      <Tabs
        id="justify-tab-example"
        className="mb-3"
        justify
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Tab eventKey="details" title="Project Details">
          <div className="project-card">
            <div className="project-image-container">
              {project.data.image ? (
                <img src={`http://localhost:3000${project.data.image}`} className="project-image" alt="Project" />
              ) : (
                <p>No image available</p>
              )}
            </div>
            <div class="project-info">
              <h5 className="tieude">{project.data.title}</h5>

              <div className="detail-row">
                <p className="tieude">Location:</p>
                <p>{project.data.location}</p>
              </div>
              <div className="detail-row">
                <p className="tieude">Category:</p>
                <p>{project.data.categories}</p>
              </div>
              <div className="detail-row">
                <p className="tieude">Status:</p>
                <p>{project.data.status}</p>
              </div>
              <div className="detail-row">
                <p className="tieude">Time:</p>
                <p>
                  {new Date(project.data.startDate).toLocaleDateString("vi-VN")} - {new Date(project.data.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="detail-row">
                <p className="tieude">Description:</p>
                <p>{project.data.description}</p>
              </div>

              <div className="button-group">
                {user?.role === "Organization" && user._id === project.data.organization.user ? (
                  <>
                    <button className="project-btn btn-edit" onClick={() => navigate(`/projects/${id}/edit`)}>✏️ Edit</button>
                    <button className="project-btn btn-delete" onClick={handleDeleteProject}>🗑 Delete</button>
                  </>
                ) : user?.role === "Volunteer" ? (
                  <button
                    onClick={handleJoinClick}
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
            </div>
          </div>
        </Tab>

        <Tab eventKey="schedule" title="Schedule">
          <div className="project-schedule">
            {/* Header */}
            <div className="schedule-header">
              <h3>📅 Lịch trình dự án</h3>
              {user?.role === "Organization" && String(user._id) === String(project.data.organization?.user) && (
                <button className="btn btn-primary" onClick={() => navigate(`/create-schedule/${id}`)}>
                  ➕ Thêm lịch trình
                </button>
              )}
            </div>

            {/* Bảng lịch trình */}
            {schedules.length !== 0 ? (
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>📆 Ngày</th>
                    <th>⏰ Giờ Bắt đầu</th>
                    <th>⏳ Giờ Kết thúc</th>
                    <th>📄 Mô tả</th>
                    <th>🔖 Trạng thái</th>
                    <th>⚙️ Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules
                    .slice()
                    .sort((a, b) => {
                      // Đưa lịch trình "Completed" xuống cuối
                      if (a.status === "Completed" && b.status !== "Completed") return 1;
                      if (a.status !== "Completed" && b.status === "Completed") return -1;

                      // So sánh theo ngày (date) trước
                      const dateA = new Date(a.date);
                      const dateB = new Date(b.date);
                      if (dateA < dateB) return -1;
                      if (dateA > dateB) return 1;

                      // Nếu ngày giống nhau, sắp xếp theo startTime
                      return a.startTime.localeCompare(b.startTime);
                    })

                    .map((schedule) => (
                      <tr key={schedule._id} className={`status-${schedule.status.toLowerCase()}`}>
                        <td>{schedule.date.split("T")[0]}</td>
                        <td>{schedule.startTime}</td>
                        <td>{schedule.endTime}</td>
                        <td>{schedule.description}</td>
                        <td><span className={`status-badge ${schedule.status.toLowerCase()}`}>{schedule.status}</span></td>
                        <td>
                          {user?.role === "Organization" && user._id === project.data.organization.user && (
                            <div className="action-buttons">
                              <button className="btn btn-warning" onClick={() => handleEditSchedule(schedule)}>✏️ Edit</button>
                              <button className="btn btn-danger" onClick={() => handleDeleteSchedule(schedule._id)}>🗑 Delete</button>
                              {schedule.status !== "Completed" && (
                                <button className="btn btn-success" onClick={() => handleCompleteSchedule(schedule._id)}>✅ Complete</button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="no-schedule">Không có lịch trình nào.</p>
            )}
          </div>

          {/* Form chỉnh sửa lịch trình */}
          {editSchedule && (
            <div className="edit-schedule-form">
              <h3>✏️ Chỉnh sửa lịch trình</h3>
              <div className="form-group">
                <label>Ngày:</label>
                <input
                  type="date"
                  value={editSchedule.date.split("T")[0]}
                  min={project?.data?.startDate?.split("T")[0]}
                  max={project?.data?.endDate?.split("T")[0]}
                  onChange={(e) => setEditSchedule({ ...editSchedule, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Giờ bắt đầu:</label>
                <input
                  type="time"
                  value={editSchedule.startTime}
                  onChange={(e) => setEditSchedule({ ...editSchedule, startTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Giờ kết thúc:</label>
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
                  }}
                />
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={editSchedule.description}
                  onChange={(e) => setEditSchedule({ ...editSchedule, description: e.target.value })}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
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
              <div className="form-group button-group">
                <button className="btn btn-success" onClick={handleUpdateSchedule}>💾 Save</button>
                <button className="btn btn-secondary" onClick={() => setEditSchedule(null)}>❌ Cancel</button>
              </div>
            </div>
          )}
        </Tab>

        {user?.role === "Organization" && user._id === project.data.organization.user && (
          <Tab eventKey="pendingVolunteers" title="Pending Volunteers">
            <div className="pending-volunteers">
              <h3>Pending Volunteers</h3>
              {volunteersList.length > 0 ? (
                volunteersList.map((v) => (
                  <li key={v.volunteer._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Fullname: {v.volunteer.fullName}</h6>
                      <p className="mb-1">DOB: {new Date(v.volunteer.dateOfBirth).toLocaleDateString("vi-VN")}</p>
                      <p className="mb-1">Gender: {v.volunteer.gender}</p>
                      <>
                        Skills:
                        {v.volunteer.skills.map((skill) => (
                          <li style={{ fontSize: 14 }} key={skill._id} className="mb-1">{skill.name}</li>
                        ))}
                      </>
                      {v.message && (
                        <div>
                          <p className="mt-2"><strong>Message:</strong></p>
                          <p className="mb-1 fst-italic">"{v.message}"</p>
                        </div>
                      )}
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
                        style={{ marginLeft: 15 }}
                      >
                        Approve
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No pending volunteers.</p>
              )}
            </div>
          </Tab>
        )}
      </Tabs>

      {/* Join Project Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join Project: {project.data.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Write a message to the project organizer:</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Introduce yourself and explain why you'd like to join this project..."
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitJoinRequest}>
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>

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
          <div className="form-group">
            <label>Start Time:</label>
            <input
              type="time"
              value={editSchedule.startTime}
              onChange={(e) => setEditSchedule({ ...editSchedule, startTime: e.target.value })}
            />
          </div>
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
              }}
            />
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