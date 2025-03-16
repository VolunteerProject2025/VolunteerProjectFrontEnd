import promo_1 from '../assets/home/img/promo_1.jpg'
import promo_2 from '../assets/home/img/promo_2.jpg'
import promo_3 from '../assets/home/img/promo_2.jpg'
import video_block from '../assets/home/img/video_block.jpg'

export function Home2() {
    return (
        <div>
<section class="promo">
					<div class="promo-slider">
						<div class="promo-slider__item promo-slider__item--style-1">
							<picture>
								<source srcset={promo_1} media="(min-width: 992px)"/><img class="img--bg" src={promo_1} alt="img"/>
							</picture>
							<div class="container">
								<div class="row">
									<div class="col-12">
										<div class="align-container">
											<div class="align-container__item">
												<div class="promo-slider__wrapper-1">
													<h2 class="promo-slider__title"><span>Some people need help and we give it!</span></h2>
												</div>
												<div class="promo-slider__wrapper-2">
													<p class="promo-slider__subtitle">Gray eel-catfish longnose whiptail catfish smalleye squaretail queen danio unicorn fish shortnose greeneye fusilier fish silver carp nibbler sharksucker tench lookdown catfish</p>
												</div>
												<div class="promo-slider__wrapper-3"><a class="button promo-slider__button button--primary" href="#">Discover</a></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="promo-slider__item promo-slider__item--style-2">
							<picture>
								<source srcset={promo_2} media="(min-width: 992px)"/><img class="img--bg" src={promo_2} alt="img"/>
							</picture>
							<div class="container">
								<div class="row">
									<div class="col-lg-8 col-xl-7">
										<div class="align-container">
											<div class="align-container__item">
												<div class="promo-slider__wrapper-1">
													<h2 class="promo-slider__title"><span>Our Helping</span><br/><span>around the world.</span></h2>
												</div>
												<div class="promo-slider__wrapper-2">
													<p class="promo-slider__subtitle">Gray eel-catfish longnose whiptail catfish smalleye squaretail queen danio unicorn fish shortnose greeneye fusilier fish silver carp nibbler sharksucker tench lookdown catfish</p>
												</div>
												<div class="promo-slider__wrapper-3"><a class="button promo-slider__button button--primary" href="#">Discover</a></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="promo-slider__item promo-slider__item--style-3">
							<picture>
								<source srcset={promo_3} media="(min-width: 992px)"/><img class="img--bg" src={promo_3} alt="img"/>
							</picture>
							<div class="container">
								<div class="row">
									<div class="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
										<div class="align-container">
											<div class="align-container__item">
												<div class="promo-slider__wrapper-1">
													<h2 class="promo-slider__title"><span>Helpo Volounteers</span><br/><span>Around the world.</span></h2>
												</div>
												<div class="promo-slider__wrapper-2">
													<p class="promo-slider__subtitle">Gray eel-catfish longnose whiptail catfish smalleye squaretail queen danio unicorn fish shortnose greeneye fusilier fish silver carp nibbler sharksucker tench lookdown catfish</p>
												</div>
												<div class="promo-slider__wrapper-3"><a class="button promo-slider__button button--primary" href="#">Discover</a></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="promo-pannel__video"><img class="img--bg" src={video_block} alt="image"/><a class="video-trigger" href="https://www.youtube.com/watch?v=_sI_Ps7JSEk"><span>Watch our video</span><i class="fa fa-play" aria-hidden="true"></i></a></div><a class="anchor promo-pannel__anchor" href="#about"> <span>Scroll Down</span></a>
					<div class="promo-pannel">
						<div class="promo-pannel__phones">
							<p class="promo-pannel__title">Phone numbers</p><a class="promo-pannel__link" href="tel:+180012345678">+ 1800 - 123 456 78</a><a class="promo-pannel__link" href="tel:+18009756511">+ 1800 - 975 65 11</a>
						</div>
						<div class="promo-pannel__email">
							<p class="promo-pannel__title">Email</p><a class="promo-pannel__link" href="mailto:support@helpo.org">support@helpo.org</a>
						</div>
						<div class="promo-pannel__socials">
							<p class="promo-pannel__title">Socials</p>
							<ul class="promo-socials">
								<li class="promo-socials__item"><a class="promo-socials__link" href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
								<li class="promo-socials__item"><a class="promo-socials__link" href="#"><i class="fa fa-google-plus" aria-hidden="true"></i></a></li>
								<li class="promo-socials__item"><a class="promo-socials__link" href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
								<li class="promo-socials__item"><a class="promo-socials__link" href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
							</ul>
						</div>
					</div>

					<div class="slider__nav slider__nav--promo">
						<div class="promo-slider__count"></div>
						<div class="slider__arrows">
							<div class="slider__prev"><i class="fa fa-chevron-left" aria-hidden="true"></i>
							</div>
							<div class="slider__next"><i class="fa fa-chevron-right" aria-hidden="true"></i>
							</div>
						</div>
					</div>
				</section>
				
				<section class="section about-us about-us--blue" id="about">
					<div class="container">
						<div class="row">
							<div class="col-lg-4">
								<div class="heading heading--primary"><span class="heading__pre-title color--mono">About Us</span>
									<h2 class="heading__title color--white"><span>Helpo Mission is</span> <span>Give for People</span></h2>
								</div><a class="button button--primary d-none d-lg-inline-block" href="about.html">More About</a>
							</div>
							<div class="col-lg-8">
								<p><strong class="color--white">Thresher shark rudd African lungfish silverside, Red salmon rockfish grunion, garpike zebra danio king-of-the-salmon banjo catfish."</strong></p>
								<p>Sea chub demoiselle whalefish zebra lionfish mud cat pelican eel. Minnow snoek icefish velvet-belly shark, California halibut round stingray northern sea robin. Southern grayling trout-perch</p>
								<p>Sharksucker sea toad candiru rocket danio tilefish stingray deepwater stingray Sacramento splittail, Canthigaster rostrata. Midshipman dartfish Modoc sucker, yellowtail kingfish basslet. Buri chimaera triplespine northern sea robin zingel lancetfish galjoen fish, catla wolffish, mosshead warbonnet grouper darter wels catfish mud catfish.</p><a class="button button--primary d-inline-block d-lg-none margin-top-30" href="about.html">More About</a>
							</div>
						</div>
					</div>
				</section>
				
				<section class="section icons-section no-padding-top">
					<div class="container">
						<div class="row offset-margin">
							<div class="col-6 col-lg-3">
								<div class="icon-item icon-item--with-line text-left">
									<div class="icon-item__img">
										<svg class="icon icon-item__icon color--mono">
											<use xlink:href="#donation"></use>
										</svg>
									</div>
									<div class="icon-item__text">
										<p class="color--white">Medicine Help</p><span class="color--white">Sea chub demoiselle whalefish zebra lionfish mud cat pelican eel. Minnow snoek icefish velvet-belly</span>
									</div>
								</div>
							</div>
							<div class="col-6 col-lg-3">
								<div class="icon-item icon-item--with-line text-left">
									<div class="icon-item__img">
										<svg class="icon icon-item__icon color--mono">
											<use xlink:href="#church"></use>
										</svg>
									</div>
									<div class="icon-item__text">
										<p class="color--white">We Build and Create</p><span class="color--white">Midshipman dartfish Modoc sucker, yellowtail kingfish basslet. Buri chimaera triplespine northern sea </span>
									</div>
								</div>
							</div>
							<div class="col-6 col-lg-3">
								<div class="icon-item icon-item--with-line text-left">
									<div class="icon-item__img">
										<svg class="icon icon-item__icon color--mono">
											<use xlink:href="#blood"></use>
										</svg>
									</div>
									<div class="icon-item__text">
										<p class="color--white">Water Delivery</p><span class="color--white">Sharksucker sea toad candiru rocket danio tilefish stingray deepwater stingray Sacramento splittail, </span>
									</div>
								</div>
							</div>
							<div class="col-6 col-lg-3">
								<div class="icon-item icon-item--with-line text-left">
									<div class="icon-item__img">
										<svg class="icon icon-item__icon color--mono">
											<use xlink:href="#charity"></use>
										</svg>
									</div>
									<div class="icon-item__text">
										<p class="color--white">We Care About</p><span class="color--white">Canthigaster rostrata. Midshipman dartfish. Sharksucker sea toad candiru rocket danio tilefish stingra</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			
				<section class="section">
					<div class="container">
						<div class="row offset-margin">
							<div class="col-md-4 text-center">
								<div class="counter-item counter-item--style-3">
									<div class="counter-item__top">
										<h6 class="counter-item__title">People We Helped on 2018</h6>
									</div>
									<div class="counter-item__lower"><span class="js-counter">200</span><span>k</span></div>
								</div>
							</div>
							<div class="col-md-4 text-center">
								<div class="counter-item counter-item--style-3">
									<div class="counter-item__top">
										<h6 class="counter-item__title">Dollars We Collected</h6>
									</div>
									<div class="counter-item__lower"><span class="js-counter">65</span><span>bil</span></div>
								</div>
							</div>
							<div class="col-md-4 text-center">
								<div class="counter-item counter-item--style-3">
									<div class="counter-item__top">
										<h6 class="counter-item__title">Closed Projects</h6>
									</div>
									<div class="counter-item__lower"><span class="js-counter">100</span><span>k +</span></div>
								</div>
							</div>
						</div>
					</div>
				</section>
        </div>
    )
}