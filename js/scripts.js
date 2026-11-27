// Mob. viewport
initAdaptiveViewport()


// Swiper accessibility messages
const swiperA11y = {
	prevSlideMessage: 'Предыдущий слайд',
	nextSlideMessage: 'Следующий слайд',
	firstSlideMessage: 'Это первый слайд',
	lastSlideMessage: 'Это последний слайд',
	paginationBulletMessage: 'Перейти к слайду {{index}}'
}


document.addEventListener('DOMContentLoaded', function() {
	// Header height for anchors
	initHeaderHeight()


	// Smooth scrolling to anchor
	document.addEventListener('click', e => {
		const btn = e.target.closest('.scroll_btn[data-anchor]')

		if (!btn) return

		e.preventDefault()

		document.getElementById(btn.dataset.anchor.replace('#', ''))?.scrollIntoView()
	})


	// Fancybox
	Fancybox.bind('[data-fancybox]', {
		l10n: Fancybox.l10n.ru_RU
	})


	// Fancybox - zoom images
	Fancybox.bind('.fancy_img', {
		l10n: Fancybox.l10n.ru_RU,
		zoomEffect: false,
		Carousel: {
			Zoomable: {
				Panzoom: {
					maxScale: 1
				}
			},
			Thumbs: {
				showOnStart: false
			}
		}
	})


	// Dialog
	document.addEventListener('click', e => {
		const openBtn = e.target.closest('[data-open-modal]')

		if (openBtn) {
			e.preventDefault()

			document.getElementById(openBtn.dataset.openModal)?.showModal()
		}


		const closeBtn = e.target.closest('[data-close-modal]')

		if (closeBtn) {
			closeBtn.closest('dialog')?.close()
		}


		// Click outside the modal content
		const modal = e.target.closest('.modal')

		if (modal && !e.target.closest('.inner')) {
			modal.close()
		}
	})


	// Mob. menu (on <= 1023px the header turns into a side panel)
	const header = document.querySelector('header'),
		overlay = document.querySelector('.overlay'),
		mqMobMenu = window.matchMedia('(max-width: 1023px)')

	if (header) {
		const toggleMobMenu = (show = !header.classList.contains('show')) => {
			header.classList.toggle('show', show)
			overlay?.classList.toggle('show', show)
			document.body.classList.toggle('lock', show)
		}

		document.querySelectorAll('.mob_header .mob_menu_btn, header .close_btn, .overlay').forEach(el => {
			el.addEventListener('click', () => toggleMobMenu())
		})

		header.querySelectorAll('.menu a:not(.sub_link)').forEach(el => {
			el.addEventListener('click', () => toggleMobMenu(false))
		})


		const subLinks = header.querySelectorAll('.menu .sub_link')

		const toggleSub = (link, show) => {
			const sub = link.nextElementSibling

			link.classList.toggle('open', show)

			if (mqMobMenu.matches) {
				show ? slideDown(sub) : slideUp(sub)
			} else {
				sub.classList.toggle('show', show)
			}
		}

		const closeSubs = currentLink => {
			subLinks.forEach(el => {
				if (el === currentLink || !el.classList.contains('open') || el.nextElementSibling.contains(currentLink)) return

				toggleSub(el, false)
			})
		}

		subLinks.forEach(link => {
			link.addEventListener('click', e => {
				if (!mqMobMenu.matches && !is_touch_device()) return

				e.preventDefault()

				closeSubs(link)
				toggleSub(link, !link.classList.contains('open'))
			})
		})

		// Close the submenu when clicking outside it
		document.addEventListener('click', e => {
			if (!mqMobMenu.matches && !e.target.closest('.menu')) closeSubs(null)
		})


		// Reset when switching between the side panel and the desktop header
		mqMobMenu.addEventListener('change', () => {
			toggleMobMenu(false)

			subLinks.forEach(link => {
				const sub = link.nextElementSibling

				stopAnimation(sub)

				link.classList.remove('open')
				sub.classList.remove('show')
				sub.style.display = ''
			})
		})
	}


	// Accordion
	document.addEventListener('click', e => {
		const head = e.target.closest('.accordion_item > .top')

		if (!head) return

		const item = head.parentElement,
			accordion = item.closest('.accordion'),
			isOpen = item.classList.contains('active')

		if (!isOpen && !accordion.classList.contains('multiple')) {
			accordion.querySelectorAll('.accordion_item.active').forEach(el => toggleAccordionItem(el, false))
		}

		toggleAccordionItem(item, !isOpen)
	})


	// Tabs
	document.addEventListener('click', e => {
		const btn = e.target.closest('.tabs .btn')

		if (!btn || btn.classList.contains('active')) return

		const container = btn.closest('.tabs_container'),
			index = [...btn.parentElement.children].indexOf(btn)

		btn.parentElement.querySelectorAll(':scope > .btn').forEach((el, i) => el.classList.toggle('active', i === index))
		container.querySelectorAll('.tab_content').forEach((el, i) => el.classList.toggle('active', i === index))
	})


	// Phone input mask
	new Maska.MaskInput('input[type=tel]', {
		mask: '+7 ### ### ####'
	})


	// Success message after submitting the form
	document.querySelectorAll('.form').forEach(el => {
		el.addEventListener('submit', e => {
			e.preventDefault()

			el.reset()
			el.closest('dialog')?.close()

			document.getElementById('success_modal')?.showModal()
		})
	})
})
