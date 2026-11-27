// reviews
(function() {
	'use strict'


	if (!window.AppSliders) {
		console.warn('[AppSliders] Core script not found. Slider "reviews" cannot be initialized.')
		return
	}

	const { qs, qsa, getCssVar, commonSlideClasses, createOrUpdateSwiper, registerInit } = window.AppSliders


	const initReviews = () => {
		qsa('.reviews').forEach(section => {
			const slider = qs('.swiper', section)

			createOrUpdateSwiper(slider, {
				...commonSlideClasses,
				loop: false,
				speed: 500,
				a11y: swiperA11y,
				slidesPerView: getCssVar(slider, '--slidesPerView'),
				navigation: {
					nextEl: qs('.swiper-button-next', section),
					prevEl: qs('.swiper-button-prev', section)
				},
				breakpoints: {
					0: {
						spaceBetween: getCssVar(slider, '--spaceBetween-0')
					},
					768: {
						spaceBetween: getCssVar(slider, '--spaceBetween-768')
					}
				}
			})
		})
	}


	registerInit(initReviews)
})()
