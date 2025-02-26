import React from "react";
import '../assets/css/home.css';
import logo_cut from '../assets/img/volunteer_act_logo_cut.png';
import join_hand from '../assets/img/join_hands_img.webp'
const events = [
    {
        img: "https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png",
        title: "This is a random volunteer event - Online Free And Guided - Beginners",
        host: "Raya Petkova"
    },
    {
        img: "https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png",
        title: "Community Cleanup Drive - Make Your City Shine!",
        host: "Alex Johnson"
    },
    {
        img: "https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png",
        title: "Tree Planting Initiative - Save the Planet",
        host: "Green Earth Foundation"
    },
    {
        img: "https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png",
        title: "Support Local Animal Shelters - Adoption Drive",
        host: "Pet Lovers United"
    }
];

export function Home() {
    return (
        <div className="main-content">
            {/* Hero Section */}
            <section className="first-section">
                <div className="left">
                    <h1>The Change Network - Where Passion Meets Purpose</h1>
                    <p>Join a community dedicated to making a difference. Whether you're looking to volunteer, donate, or connect, VolunteerAct is your gateway to meaningful action.</p>
                    <button className="btn-primary">Join VolunteerAct</button>
                </div>
                <div className="right">
                    <img src={logo_cut} alt="Volunteer Act Logo" />
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="upcoming-events">
                <div className="title-container">
                    <h2>Upcoming Events</h2>
                    <a href="#">See all events</a>
                </div>

                <div className="events">
                    {events.map((event, index) => (
                        <div key={index} className="event-container">
                            <div className="img-container">
                                <img src={event.img} alt="event-img" />
                            </div>
                            <div className="info">
                                <h6>{event.title}</h6>
                                <p>Hosted by: {event.host}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Section */}
            <section className="join-section">
                <div className="left">
                    <h2>Join VolunteerAct</h2>
                    <p>Connect with others, support causes, and turn your passion into action.</p>
                    <button className="btn-secondary">Sign Up</button>
                </div>
                <div className="right">
                    <img src={join_hand} alt="join-hands-img" />
                </div>
            </section>
        </div>
    );
}
