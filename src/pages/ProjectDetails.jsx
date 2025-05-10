import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { deleteProject } from "../hooks/projectService";
import '../assets/css/button.css';
import '../assets/css/img.css';
import '../assets/css/projectdetail.css';
import '../assets/css/schedule.css';
import '../assets/css/statusSchedule.css';
import '../assets/css/schedulestatus.css';

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [editSchedule, setEditSchedule] = useState(null); // ⬅️ Thêm state để chỉnh sửa lịch trình
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setProject(data));

    fetch(`http://localhost:3000/schedules/project/${id}`)
      .then((res) => res.json())
      .then((data) => setSchedules(data || []));
  }, [id]);

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      navigate("/project");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      await fetch(`http://localhost:3000/schedules/${scheduleId}`, { method: "DELETE" });
      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditSchedule(schedule); // ⬅️ Mở form chỉnh sửa với dữ liệu lịch trình đã chọn
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

      // Cập nhật danh sách lịch trình
      setSchedules(schedules.map((s) => (s._id === updatedSchedule._id ? updatedSchedule : s)));
      setEditSchedule(null); // Đóng form sau khi cập nhật
      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule.");
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="project-container">
      {/* Cột bên trái: Thông tin dự án */}
      <div className="project-details">
        <h2 className="tieude">Tên dự án: {project.title}</h2>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "20%" }}>Mô tả dự án:</p>
          <p > {project.data.description}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Location: </p>
          <p>{project.data.location}</p></div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Category:</p>
          <p> {project.data.categories}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Status: </p>
          <p>{project.data.status}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>Start Date:</p>
          <p> {project.data.startDate?.split("T")[0]}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="tieude" style={{ width: "18%" }}>End Date:</p>
          <p> {project.data.endDate?.split("T")[0]}</p>
        </div>


        <div className="button-group">
          {user.role === "Organization" && user._id === project.data.organization.user ? (
            <>
              <button className="project-btn btn-edit" onClick={() => navigate(`/projects/${id}/edit`)}>✏️ Edit</button>
              <button className="project-btn btn-delete" onClick={handleDeleteProject}>🗑 Delete</button>
              <button className="project-btn btn-add" onClick={() => navigate(`/create-schedule/${id}`)}>➕ Thêm lịch trình</button>
            </>
          ) : (
            <button className="project-btn btn-join">✅ Join Project</button>
          )}
        </div>

        <div className="project-image-container">
          {project.data.image ? (
            <img src={`http://localhost:3000${project.data.image}`} className="project-image" alt="Project" />
          ) : (
            <p>No image available</p>
          )}
        </div>
      </div>

      {/* Cột bên phải: Danh sách lịch trình */}
      <div className="project-schedule">
        <h3>📅 Lịch trình dự án</h3>
        {schedules.length !== 0 ? (
          <ul>
            <ul>
              {schedules.map((schedule) => (
                <li
                  className={`schedule-item ${schedule.status}`}
                  key={schedule._id}
                >
                  <strong>{schedule.date.split("T")[0]}</strong>: {schedule.startTime} - {schedule.endTime}
                  <p>{schedule.description}</p>
                  <p><strong>Trạng thái:</strong> {schedule.status}</p>

                  {user.role === "Organization" && user._id === project.data.organization.user && (
                    <div className="schedule-actions">
                      <button className="project-btn btn-edit" onClick={() => handleEditSchedule(schedule)}>✏️ Edit</button>
                      <button className="project-btn btn-delete" onClick={() => handleDeleteSchedule(schedule._id)}>🗑 Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ul>
        ) : (
          <p>Không có lịch trình nào.</p>
        )}
      </div>

      {editSchedule && (
        <div className="edit-schedule-form">
          <h3> Edit Schedule</h3>


          <div className="form-group">
            <label>Date:</label>
            <input type="date" value={editSchedule.date.split("T")[0]} onChange={(e) => setEditSchedule({ ...editSchedule, date: e.target.value })} />
          </div>
          <div className="form-group"><label>Start Time:</label>
            <input type="time" value={editSchedule.startTime} onChange={(e) => setEditSchedule({ ...editSchedule, startTime: e.target.value })} /></div>
          <div className="form-group">
            <label>End Time:</label>
            <input type="time" value={editSchedule.endTime} onChange={(e) => setEditSchedule({ ...editSchedule, endTime: e.target.value })} />
          </div>


          <div className="form-group">
            <label>Description:</label>
            <textarea value={editSchedule.description} onChange={(e) => setEditSchedule({ ...editSchedule, description: e.target.value })}></textarea>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={editSchedule.status}
              onChange={(e) => setEditSchedule({ ...editSchedule, status: e.target.value })}
              className={`status-select ${editSchedule.status.toLowerCase()}`} // Thêm class động
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <div className="button-group">
              <button className="btn-save" onClick={handleUpdateSchedule}> Save</button>
              <button className="btn-cancel" onClick={() => setEditSchedule(null)}> Cancel</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Lịch trình dự án (React Big Calendar)
export function ProjectSchedulesCalendar({ projectId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/schedules/project/${projectId}/`)
      .then((res) => res.json())
      .then((schedules) => {
        const calendarEvents = schedules.map((schedule) => ({
          title: schedule.description || "Untitled Event",
          start: new Date(schedule.date),
          end: new Date(schedule.endDate || schedule.date),
          allDay: schedule.allDay || false,
        }));
        setEvents(calendarEvents);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [projectId]);

  if (isLoading) return <div>Loading schedules...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6 p-5 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">Project Schedules</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 420 }}
        views={["month", "week", "day", "agenda"]}
        tooltipAccessor={(event) => event.title}
        className="mt-4"
      />
    </div>
  );
}
