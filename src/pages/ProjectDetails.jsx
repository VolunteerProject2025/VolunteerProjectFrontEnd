import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Localizer is required for react-big-calendar
const localizer = momentLocalizer(moment);

export function ProjectSchedulesCalendar({ projectId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/schedules/project/${projectId}/`);

        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const schedules = await response.json();

        const calendarEvents = schedules.map(schedule => ({
          title: schedule.description || 'Untitled Event',
          start: new Date(schedule.date),
          end: new Date(schedule.endDate || schedule.date),
          allDay: schedule.allDay || false,
        }));

        setEvents(calendarEvents);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [projectId]);

  const customStyles = {
    height: 500,
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  if (isLoading) {
    return <div>Loading schedules...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={customStyles}>
      <h2>Project Schedules</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 420 }}
        views={['month', 'week', 'day', 'agenda']}
        tooltipAccessor={(event) => event.title}
      />
    </div>
  );
}

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Project Details
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Project Data Full Response:", data);
        if (data && data.data) {
          setProject(data.data);
        } else {
          console.warn("Unexpected project data structure:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
      });
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>

      <button onClick={() => navigate(`/projects/${id}/edit`)}>Update Project</button>

      {/* Organization Display */}
      {project.organization && project.organization.name ? (
        <p><strong>Organization:</strong> {project.organization.name}</p>
      ) : (
        <p><strong>Organization:</strong> Not assigned</p>
      )}

      {/* Volunteers Display */}
      <div> 
        <h3>Volunteers</h3> 
        {project.volunteer && project.volunteer.length > 0 ? ( 
          <ul> 
            {project.volunteer.map((vol, index) => (  
              <li key={vol._id || index}>
                {vol.user ? (
                  <>
                    <p>Name: {vol.user.fullName || 'N/A'}</p>
                    <p>Email: {vol.user.email || 'N/A'}</p>
                  </>
                ) : (
                  'Volunteer details unavailable'
                )}
              </li> 
            ))} 
          </ul> 
        ) : ( 
          <p>No volunteers assigned.</p> 
        )} 
      </div>


      {/* Schedules Calendar */}
      <ProjectSchedulesCalendar projectId={id} />

      <button onClick={() => navigate(`/projects/${id}/schedules`)}>Create Schedule</button>
    </div>
  );
}