import { useState, useEffect } from "react";
import { fetchProjects } from "../hooks/projectService";
import { useNavigate } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import ReactPaginate from "react-paginate";
import '../assets/css/listProject.css';

export function Home2() {
	const [projects, setProjects] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [projectsPerPage] = useState(6); // Number of projects per page
	const navigate = useNavigate();

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
		navigate(`/projects/${id}`);
	};

	// Get current projects
	const pageCount = Math.ceil((projects.length || 0) / projectsPerPage);
	const offset = currentPage * projectsPerPage;
	const currentProjects = Array.isArray(projects) ?
		projects.slice(offset, offset + projectsPerPage) : [];

	// Handle page change
	const handlePageClick = (event) => {
		setCurrentPage(event.selected);
	};

	// Card style for consistent appearance
	const cardStyle = {
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	};

	const imageContainerStyle = {
		height: '200px',
		overflow: 'hidden',
		position: 'relative'
	};

	const imageStyle = {
		width: '100%',
		height: '100%',
		objectFit: 'cover'
	};

	const descriptionStyle = {
		height: '80px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		display: '-webkit-box',
		WebkitLineClamp: 3,
		WebkitBoxOrient: 'vertical'
	};

	const cardBodyStyle = {
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column'
	};

	const titleStyle = {
		height: '50px',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical'
	};

	return (
		<div>
			<Carousel fade>
				<Carousel.Item>
					<img
						className="d-block w-100"
						style={{ height: 650 }}
						src="https://malawirelief.org/wp-content/uploads/2021/02/promo_2.jpg"
						alt="First slide"
					/>
					{/* <Carousel.Caption>
						<h3>First slide label</h3>
						<p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
					</Carousel.Caption> */}
				</Carousel.Item>
				<Carousel.Item>
					<img
						className="d-block w-100"
						style={{ height: 650 }}
						src="https://malawirelief.org/wp-content/uploads/2020/03/volunteer-2.png"
						alt="Second slide"
					/>
					{/* <Carousel.Caption>
						<h3>Second slide label</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
					</Carousel.Caption> */}
				</Carousel.Item>
				<Carousel.Item>
					<img
						className="d-block w-100"
						style={{ height: 650 }}
						src="https://malawirelief.org/wp-content/uploads/2020/03/blog_2.png"
						alt="Third slide"
					/>
					{/* <Carousel.Caption>
						<h2 style={{color: 'white', marginTop: -250}}>Preparing for the Future</h2>
						<p>Education for children in nurseries, primary, high school, colleges...</p>
					</Carousel.Caption> */}
				</Carousel.Item>
			</Carousel>

			<div className="container" style={{ marginTop: 125 }}>
				{/* <img style={{position: "absolute", top: 700, right: 0, objectFit: "cover", zIndex: -1}}src="https://malawirelief.org/wp-content/uploads/2021/02/causes_img_opt.png" alt="img" /> */}
				<img style={{position: "absolute", top: 700, right: 0, objectFit: "cover", zIndex: -1, opacity: 0.36}}src="https://malawirelief.org/wp-content/uploads/2021/02/blog_bg_new.png" alt="img" />
				{/* <img style={{position: "absolute", top: 700, left: 0, objectFit: "cover", zIndex: -1}}src="https://malawirelief.org/wp-content/uploads/2021/02/events_bg_opt.png" alt="img" /> */}
				<div className="row">
					{Array.isArray(currentProjects) && currentProjects.length > 0 ? (
						currentProjects.map((project) => (
							<div key={project._id} className="col-md-6 col-lg-4 mb-4">
								<div className="causes-item causes-item--primary" style={cardStyle}>
									<div className="causes-item__body" style={cardBodyStyle}>
										<div className="causes-item__top">
											<h6 className="causes-item__title" style={titleStyle}>Dự án: {project.title}</h6>
										</div>
										<div className="causes-item__img" style={imageContainerStyle}>
											<div className="causes-item__badge" style={{ backgroundColor: "#49C2DF", position: "absolute", top: "10px", left: "10px", zIndex: "1", padding: "5px 10px", borderRadius: "3px" }}>
												{project.categories || "No Category"}
											</div>
											<img style={imageStyle} className="img--bg" src={`http://localhost:3000${project.image}`} alt="Project" />
										</div>
										<p className="causes-item__description" style={descriptionStyle}>Mô tả dự án: {project.description}</p>
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

				{/* ReactPaginate Component with Enhanced Styling */}
				{projects.length > 0 && (
					<div className="pagination-container text-center mt-4 mb-5">
						<ReactPaginate
							previousLabel={"<<"}
							nextLabel={">>"}
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
							// Enhanced styling for pagination
							disabledClassName={"disabled"}
						/>
					</div>
				)}
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

			<style jsx>{`
                .pagination {
                    display: flex;
                    list-style: none;
                    padding: 0;
                }
                
                .page-item {
                    margin: 0 3px;
                }
                
                .page-link {
                    color: #49C2DF;
                    background-color: #fff;
                    border: 1px solid #dee2e6;
                    padding: 8px 14px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .page-item.active .page-link {
                    background-color: #49C2DF;
                    color: white;
                    border-color: #49C2DF;
                }
                
                .page-link:hover {
                    background-color: #e9ecef;
                    color: #49C2DF;
                }
                
                .page-item.disabled .page-link {
                    color: #6c757d;
                    pointer-events: none;
                    cursor: not-allowed;
                }

                .causes-item {
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    background-color: white;
                    overflow: hidden;
                }
                
                .causes-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }
                
                .causes-item__title {
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .causes-item__button {
                    margin-top: auto;
                    align-self: center;
                    width: 100%;
                    border: none;
                    background-color: #49C2DF;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 0 0 8px 8px;
                    transition: background-color 0.3s ease;
                }
                
                .causes-item__button:hover {
                    background-color: #3ba5c0;
                }
                
                .causes-item__body {
                    padding: 20px;
                }
            `}</style>
		</div>
	)
}