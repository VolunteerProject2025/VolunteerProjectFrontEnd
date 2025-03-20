import { useState, useEffect } from "react";
import { fetchProjects } from "../hooks/projectService";
import { useNavigate } from "react-router-dom";
import '../assets/css/listProject.css';


export function Home2() {
	const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    console.log("Full Project Data:", projects);
	useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const projectsData = await fetchProjects();
            console.log("Fetched Projects:", projectsData);
            

            setProjects(projectsData || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

   
    const handleViewDetails = (id) => {
      navigate(`/projects/${id}`); // ✅ Điều hướng đến trang chi tiết
  };

	return (
		<div>
			{/*  */}
			<div className="container">
              <div className="row">
                {Array.isArray(projects) && projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id} className="col-md-6 col-lg-4"  >
                            <div className="causes-item causes-item--primary">
                                <div className="causes-item__body">
                                    <div className="causes-item__top">
                                        <h6 className="causes-item__title">Dự án: {project.title}</h6>
                                        
                                    </div>
                                    <div className="causes-item__img">
                                        <div className="causes-item__badge" style={{ backgroundColor: "#49C2DF" }}>
                                            {project.categories || "No Category"}
                                        </div>
                                        <img style={{width: "100%"}} className="img--bg" src={`http://localhost:3000${project.image}`} alt="Project" />
                                    </div>

                                    <p className="causes-item__description">Mô tả dự án: {project.description}</p>
                                </div>
                                <button className="button causes-item__button button--primary" onClick={() => handleViewDetails(project._id)}>
                                Detail
                            </button>
                               
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </div>
			<section className="section about-us about-us--blue" id="about">
				<div className="container">
					<div className="row">
						<div className="col-lg-4">
							<div className="heading heading--primary"><span className="heading__pre-title color--mono">About Us</span>
								<h2 className="heading__title color--white"><span>Helpo Mission is</span> <span>Give for People</span></h2>
							</div><a className="button button--primary d-none d-lg-inline-block" href="about.html">More About</a>
						</div>
						<div className="col-lg-8">
							<p><strong className="color--white">Thresher shark rudd African lungfish silverside, Red salmon rockfish grunion, garpike zebra danio king-of-the-salmon banjo catfish."</strong></p>
							<p>Sea chub demoiselle whalefish zebra lionfish mud cat pelican eel. Minnow snoek icefish velvet-belly shark, California halibut round stingray northern sea robin. Southern grayling trout-perch</p>
							<p>Sharksucker sea toad candiru rocket danio tilefish stingray deepwater stingray Sacramento splittail, Canthigaster rostrata. Midshipman dartfish Modoc sucker, yellowtail kingfish basslet. Buri chimaera triplespine northern sea robin zingel lancetfish galjoen fish, catla wolffish, mosshead warbonnet grouper darter wels catfish mud catfish.</p><a className="button button--primary d-inline-block d-lg-none margin-top-30" href="about.html">More About</a>
						</div>
					</div>
				</div>
			</section>

			<section className="section icons-section no-padding-top">
				<div className="container">
					<div className="row offset-margin">
						<div className="col-6 col-lg-3">
							<div className="icon-item icon-item--with-line text-left">
								<div className="icon-item__img">
									<svg className="icon icon-item__icon color--mono">

									</svg>
								</div>
								<div className="icon-item__text">
									<p className="color--white">Medicine Help</p><span className="color--white">Sea chub demoiselle whalefish zebra lionfish mud cat pelican eel. Minnow snoek icefish velvet-belly</span>
								</div>
							</div>
						</div>
						<div className="col-6 col-lg-3">
							<div className="icon-item icon-item--with-line text-left">
								<div className="icon-item__img">
									<svg className="icon icon-item__icon color--mono">
									</svg>
								</div>
								<div className="icon-item__text">
									<p className="color--white">We Build and Create</p><span className="color--white">Midshipman dartfish Modoc sucker, yellowtail kingfish basslet. Buri chimaera triplespine northern sea </span>
								</div>
							</div>
						</div>
						<div className="col-6 col-lg-3">
							<div className="icon-item icon-item--with-line text-left">
								<div className="icon-item__img">
									<svg className="icon icon-item__icon color--mono">
									</svg>
								</div>
								<div className="icon-item__text">
									<p className="color--white">Water Delivery</p><span className="color--white">Sharksucker sea toad candiru rocket danio tilefish stingray deepwater stingray Sacramento splittail, </span>
								</div>
							</div>
						</div>
						<div className="col-6 col-lg-3">
							<div className="icon-item icon-item--with-line text-left">
								<div className="icon-item__img">
									<svg className="icon icon-item__icon color--mono">
									</svg>
								</div>
								<div className="icon-item__text">
									<p className="color--white">We Care About</p><span className="color--white">Canthigaster rostrata. Midshipman dartfish. Sharksucker sea toad candiru rocket danio tilefish stingra</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="section">
				<div className="container">
					<div className="row offset-margin">
						<div className="col-md-4 text-center">
							<div className="counter-item counter-item--style-3">
								<div className="counter-item__top">
									<h6 className="counter-item__title">People We Helped on 2018</h6>
								</div>
								<div className="counter-item__lower"><span className="js-counter">200</span><span>k</span></div>
							</div>
						</div>
						<div className="col-md-4 text-center">
							<div className="counter-item counter-item--style-3">
								<div className="counter-item__top">
									<h6 className="counter-item__title">Dollars We Collected</h6>
								</div>
								<div className="counter-item__lower"><span className="js-counter">65</span><span>bil</span></div>
							</div>
						</div>
						<div className="col-md-4 text-center">
							<div className="counter-item counter-item--style-3">
								<div className="counter-item__top">
									<h6 className="counter-item__title">Closed Projects</h6>
								</div>
								<div className="counter-item__lower"><span className="js-counter">100</span><span>k +</span></div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}