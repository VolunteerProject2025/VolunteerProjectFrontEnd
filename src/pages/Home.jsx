import React from "react";
import '../assets/css/home.css'
export function Home() {
    return(
      <div className="main-content">
        <section className="first-section">
            <div className="left">
                <h1>The Change Network - Where Passion Meets Purpose</h1>

                <p>Discover a community dedicated to making a difference. Whether you're looking to volunteer your time, donate to a worthy cause, or simply connect with like-minded individuals, VolunteerAct is your gateway to meaningful action. Explore various categories, join impactful events, and be part of a movement that’s changing the world!</p>

                <button>Join VolunteerAct</button>
            </div>

            <div className="right">
                <img src="../images/volunteer_act_logo_cut.png" alt="logo-img" />
            </div>
        </section>

        <section className="upcoming-events">
            <div className="title-container">
                <h2>Upcoming events</h2>
                <a href="#">See all events</a>
            </div>

            <div className="events">
                <div className="event-container">
                    <div className="img-container">
                        <img src="https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png" alt="event-img"/>
                    </div>

                    <div className="info">
                        <h6>This is a random volunteer event - Online Free And Guided - Beginners</h6>
                        <p>Hosted by: Raya Petkova</p>
                    </div>
                </div>

                <div className="event-container">
                    <div className="img-container">
                        <img src="https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png" alt="event-img"/>
                    </div>

                    <div className="info">
                        <h6>This is a random volunteer event - Online Free And Guided - Beginners</h6>
                        <p>Hosted by: Raya Petkova</p>
                    </div>
                </div>

                <div className="event-container">
                    <div className="img-container">
                        <img src="https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png" alt="event-img"/>
                    </div>

                    <div className="info">
                        <h6>This is a random volunteer event - Online Free And Guided - Beginners</h6>
                        <p>Hosted by: Raya Petkova</p>
                    </div>
                </div>

                <div className="event-container">
                    <div className="img-container">
                        <img src="https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043_640.png" alt="event-img"/>
                    </div>

                    <div className="info">
                        <h6>This is a random volunteer event - Online Free And Guided - Beginners</h6>
                        <p>Hosted by: Raya Petkova</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="join-section">
            <div className="left">
                <h2>Join VolunteerAct</h2>

                <p>People use VolunteerAct to connect with others, support meaningful causes, and turn their passion for helping into action.</p>

                <button>Sign Up</button>
            </div>

            <div className="right">
                <img src="../images/join_hands_img.webp" alt="join-hands-img"/>
            </div>
        </section>

        <section className="explore-categories">
            <h2>Explore categories</h2>

            <div className="categories">
                <div className="category-container">
                    <img src="../images/environment.png" alt="elder_care"/>
                    <p>Environment</p>
                </div>

                <div className="category-container">
                    <img src="../images/food.png" alt="elder_care"/>
                    <p>Food & Hunger Relief</p>
                </div>

                <div className="category-container">
                    <img src="../images/animals.png" alt="elder_care"/>
                    <p>Animals & Wildlife</p>
                </div>

                <div className="category-container">
                    <img src="../images/elder_care.png" alt="elder_care"/>
                    <p>Elder Care</p>
                </div>

          

            </div>
        </section>

        <section className="popular-cities-section">
            <h2>Popular cities on VolunteerAct</h2>

            <div className="cities">
                <div className="city-container">
                    <button>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/%D0%98%D0%B7%D0%B3%D0%BB%D0%B5%D0%B4_%D0%BE%D1%82_%D0%9A%D0%B0%D0%BC%D0%B1%D0%B0%D0%BD%D0%B0%D1%80%D0%B8%D1%8F%D1%82%D0%B0_%D0%B2_%D0%A5%D0%B0%D1%81%D0%BA%D0%BE%D0%B2%D0%BE.JPG" alt="city-img"/>
                    </button>
                    
                    <a>Haskovo</a>
                </div>

   
            </div>
        </section>

        <section className="how-volunteeract-works">
            <h2>How VolunteerAct works</h2>

            <div className="containers">
                <div className="box">
                    <div className="img-container">
                        <img src="../images/search_img.png" alt="search_img" />
                    </div>

                    <div className="info">
                        <h6>Discover events</h6>

                        <p>Explore who’s hosting local and online events for all the things you love. Find out about passionate individuals and organizations creating opportunities for you to get involved.</p>

                        <a href="#">Search events</a>
                    </div>
                </div>

              
            </div>
        </section>
    </div>

    );
}