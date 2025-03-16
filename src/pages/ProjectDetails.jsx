import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinProject } from "../hooks/projectService";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [participationStatus, setParticipationStatus] = useState(null);
  const [role, setRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // ✅ Fetch User Data
    fetch(`http://localhost:3000/auth/me`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch user role"))
      .then((data) => {
        setRole(data?.user?.role);
        setUserEmail(data?.user?.email);
      })
      .catch((err) => console.error("Error fetching user role:", err));

    // ✅ Fetch Project Details
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setProject(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
      });

    // ✅ Fetch Volunteers who have been "Accepted"
    fetch(`http://localhost:3000/projects/${id}/volunteers?page=${currentPage}&limit=10`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setVolunteers(data.data);
        setTotalVolunteers(data.total);
        setTotalPages(data.totalPages);
        
        // ✅ Kiểm tra nếu user đã tham gia dự án
        const userParticipation = data.data.find(vol => vol.email === userEmail);
        if (userParticipation) {
          setParticipationStatus(userParticipation.status);
        }
      }
    })
    .catch((err) => console.error("Error fetching project volunteers:", err));

    console.log("🔄 Fetching participation status...");
    fetch(`http://localhost:3000/projects/${id}/participation-status`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
            console.log("Participation Status:", data.status);
            setParticipationStatus(data.status); //Giữ trạng thái khi reload
        })
        .catch((err) => console.error("Error fetching participation status:", err));
}, [id, currentPage, userEmail]);

const handleJoinProject = () => {
  console.log("Joining project with ID:", id);
  console.log("User email:", userEmail);

  fetch(`http://localhost:3000/projects/${id}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
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

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!project) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>
        <p className="text-gray-600 mt-2">{project.description}</p>
      </div>

      {/* Status */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold">
          Status: {project.status}
        </span>
        <span className="px-4 py-2 bg-green-100 text-green-600 rounded-lg font-semibold">
          Start: {new Date(project.startDate).toLocaleDateString()}
        </span>
        <span className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold">
          End: {new Date(project.endDate).toLocaleDateString()}
        </span>
      </div>

      {/* Organization */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700">Organization</h3>
        <p className="text-gray-500">{project.organization?.name || "Not assigned"}</p>
      </div>

      {/* Volunteers */}
      {/* Volunteers Section */}
      <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700">Volunteers</h3>

          {role === "Volunteer" ? (
              <p className="text-gray-500">Total Volunteers: {totalVolunteers}</p>
          ) : (
              <>
                  {volunteers.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                          {volunteers.map((vol, index) => (
                              <li key={vol._id} className="p-3 border rounded-md shadow-sm bg-gray-50">
                                  <p className="font-semibold">{vol.fullName || "Anonymous"}</p>
                                  <p className="text-gray-500 text-sm">{vol.email || "No email available"}</p>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-gray-500">No accepted volunteers yet.</p>
                  )}

                  {/* ✅ Pagination if more than 10 volunteers */}
                  {totalPages > 1 && (
                      <div className="mt-4 flex justify-center">
                          <button
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              className={`px-4 py-2 mx-1 ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg`}
                          >
                              Previous
                          </button>
                          <span className="px-4 py-2 mx-1">{`Page ${currentPage} of ${totalPages}`}</span>
                          <button
                              disabled={currentPage === totalPages}
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              className={`px-4 py-2 mx-1 ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg`}
                          >
                              Next
                          </button>
                      </div>
                  )}
              </>
          )}
      </div>

      {/* Buttons */}
      <div className="mt-6 text-center">
        {role === "Volunteer" && (
          <button
          onClick={handleJoinProject}
          disabled={participationStatus === "Pending" || participationStatus === "Accepted"}
          className={`w-full md:w-auto px-6 py-3 rounded-lg text-lg font-semibold transition-all 
            ${
              participationStatus === "Accepted"
                ? "bg-green-500 text-black cursor-default"
                : participationStatus === "Pending"
                ? "bg-orange-500 text-black cursor-default"
                : participationStatus === "Rejected"
                ? "bg-red-500 text-black cursor-default"  
                : "bg-blue-500 text-black hover:bg-blue-600"
            }
          `}
          style={{
            color: "#ffffff",
            border: participationStatus === "Pending" ? "2px solid #FFA500" : "none",
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
            : "Join Project"}
        </button>
        )}

        {role === "Organization" && (
          <>
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="mt-4 md:mt-0 ml-3 w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-lg font-semibold"
            >
              Edit Project
            </button>
            <button
              onClick={() => navigate(`/projects/${id}/schedules`)}
              className="mt-4 md:mt-0 ml-3 w-full md:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-semibold"
            >
              Create Schedule
            </button>
          </>
        )}
      </div>

      {/* Project Schedules */}
      <ProjectSchedulesCalendar projectId={id} />
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
