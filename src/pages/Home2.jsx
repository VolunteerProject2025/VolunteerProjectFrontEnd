import promo_1 from '../assets/home/img/promo_1.jpg'
import promo_2 from '../assets/home/img/promo_2.jpg'
import promo_3 from '../assets/home/img/promo_2.jpg'
import video_block from '../assets/home/img/video_block.jpg'

export function Home2() {
    return (
        <div>
<section className="promo">
					<div className="promo-slider">
						
						
						<div className="promo-slider__item promo-slider__item--style-3">
							<picture>
								<source srcSet={promo_3} media="(min-width: 992px)"/><img className="img--bg" src={promo_3} alt="img"/>
							</picture>
							<div className="container">
								<div className="row">
									<div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
										<div className="align-container">
											<div className="align-container__item">
												<div className="promo-slider__wrapper-1">
													<h2 className="promo-slider__title"><span>Helpo Volounteers</span><br/><span>Around the world.</span></h2>
												</div>
												<div className="promo-slider__wrapper-2">
													<p className="promo-slider__subtitle">Gray eel-catfish longnose whiptail catfish smalleye squaretail queen danio unicorn fish shortnose greeneye fusilier fish silver carp nibbler sharksucker tench lookdown catfish</p>
												</div>
												<div className="promo-slider__wrapper-3"><a className="button promo-slider__button button--primary" href="#">Discover</a></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="promo-pannel__video"><img className="img--bg" src={video_block} alt="image"/><a className="video-trigger" href="https://www.youtube.com/watch?v=_sI_Ps7JSEk"><span>Watch our video</span><i className="fa fa-play" aria-hidden="true"></i></a></div><a className="anchor promo-pannel__anchor" href="#about"> <span>Scroll Down</span></a>
					<div className="promo-pannel">
						<div className="promo-pannel__phones">
							<p className="promo-pannel__title">Phone numbers</p><a className="promo-pannel__link" href="tel:+180012345678">+ 1800 - 123 456 78</a><a className="promo-pannel__link" href="tel:+18009756511">+ 1800 - 975 65 11</a>
						</div>
						<div className="promo-pannel__email">
							<p className="promo-pannel__title">Email</p><a className="promo-pannel__link" href="mailto:support@helpo.org">support@helpo.org</a>
						</div>
						<div className="promo-pannel__socials">
							<p className="promo-pannel__title">Socials</p>
							<ul className="promo-socials">
								<li className="promo-socials__item"><a className="promo-socials__link" href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
								<li className="promo-socials__item"><a className="promo-socials__link" href="#"><i className="fa fa-google-plus" aria-hidden="true"></i></a></li>
								<li className="promo-socials__item"><a className="promo-socials__link" href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
								<li className="promo-socials__item"><a className="promo-socials__link" href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
							</ul>
						</div>
					</div>

					<div className="slider__nav slider__nav--promo">
						<div className="promo-slider__count"></div>
						<div className="slider__arrows">
							<div className="slider__prev"><i className="fa fa-chevron-left" aria-hidden="true"></i>
							</div>
							<div className="slider__next"><i className="fa fa-chevron-right" aria-hidden="true"></i>
							</div>
						</div>
					</div>
				</section>
				
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