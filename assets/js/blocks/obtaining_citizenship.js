// obtaining_citizenship
(function() {
	'use strict'


	if (!window.AppSliders) {
		console.warn('[AppSliders] Core script not found. Slider "obtaining_citizenship" cannot be initialized.')
		return
	}

	const { qs, qsa, getCssVar, commonSlideClasses, createOrUpdateSwiper, registerInit } = window.AppSliders


	// Slider only on mobile, on wider screens - grid
	const initObtainingCitizenship = () => {
		const isMob = window.matchMedia('(max-width: 767px)').matches

		qsa('.obtaining_citizenship').forEach(section => {
			const slider = qs('.swiper', section)

			if (!isMob) {
				slider.swiper?.destroy(true, true)
				return
			}

			createOrUpdateSwiper(slider, {
				...commonSlideClasses,
				loop: false,
				speed: 500,
				a11y: swiperA11y,
				spaceBetween: getCssVar(slider, '--spaceBetween'),
				slidesPerView: 'auto',
				navigation: {
					nextEl: qs('.swiper-button-next', section),
					prevEl: qs('.swiper-button-prev', section)
				}
			})
		})
	}


	registerInit(initObtainingCitizenship)
})()
