// citizenship_eligibility
(function() {
	'use strict'


	if (!window.AppSliders) {
		console.warn('[AppSliders] Core script not found. Slider "citizenship_eligibility" cannot be initialized.')
		return
	}

	const { qs, qsa, getCssVar, commonSlideClasses, createOrUpdateSwiper, registerInit } = window.AppSliders


	// Slider only on mobile, on wider screens - grid
	const initCitizenshipEligibility = () => {
		const isMob = window.matchMedia('(max-width: 767px)').matches

		qsa('.citizenship_eligibility').forEach(section => {
			const slider = qs('.swiper', section)

			// Total number of slides for the counter in the cards
			section.style.setProperty('--slides_total', `'${qsa('.swiper-slide', slider).length}'`)

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


	registerInit(initCitizenshipEligibility)
})()
