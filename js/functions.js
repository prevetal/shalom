// Mob. viewport
const initAdaptiveViewport = () => {
	const viewportMeta = document.querySelector('meta[name="viewport"]')
	if (!viewportMeta) return

	const mqDeviceNarrow = window.matchMedia('(max-device-width: 374px)')

	const apply = () => {
		mqDeviceNarrow.matches
			? viewportMeta.setAttribute('content', 'width=375, user-scalable=no')
			: viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1')
	}

	apply()

	mqDeviceNarrow.addEventListener('change', apply)
}


// Height of the fixed/sticky header in --header_height (used in scroll-margin-top)
const initHeaderHeight = () => {
	const headers = document.querySelectorAll('header, .mob_header')

	const update = () => {
		let height = 0

		headers.forEach(el => {
			const position = getComputedStyle(el).position,
				rect = el.getBoundingClientRect()

			// The header in the form of a side panel is not taken into account
			if ((position === 'fixed' || position === 'sticky') && rect.right > 0 && rect.left < window.innerWidth && rect.height < window.innerHeight) {
				height = Math.max(height, rect.height)
			}
		})

		document.documentElement.style.setProperty('--header_height', height + 'px')
	}

	update()

	const resizeObserver = new ResizeObserver(update),
		mutationObserver = new MutationObserver(update)

	headers.forEach(el => {
		resizeObserver.observe(el)
		mutationObserver.observe(el, { attributes: true, attributeFilter: ['class'] })
	})

	window.addEventListener('resize', update)
}


const getCssVar = (el, name) => {
	const val = getComputedStyle(el).getPropertyValue(name).trim(),
		num = parseFloat(val)

	return isNaN(num) ? val : num
}


const is_touch_device = () => window.matchMedia('(hover: none)').matches



// Animations (analog of jQuery slideDown/slideUp/fadeIn/fadeOut)
// A new call interrupts the current animation and continues from the current state.
// Each function returns a Promise: true - finished, false - interrupted
const runningAnimations = new WeakMap()

const BOX_ZERO = {
	height: '0px',
	paddingTop: '0px',
	paddingBottom: '0px',
	marginTop: '0px',
	marginBottom: '0px'
}


const isHidden = el => getComputedStyle(el).display === 'none'


const showElement = el => {
	el.style.display = ''

	if (isHidden(el)) el.style.display = 'block'
}


const getBoxState = el => {
	const style = getComputedStyle(el)

	return {
		height: el.offsetHeight + 'px',
		paddingTop: style.paddingTop,
		paddingBottom: style.paddingBottom,
		marginTop: style.marginTop,
		marginBottom: style.marginBottom
	}
}


const stopAnimation = el => {
	runningAnimations.get(el)?.animation.cancel()
	runningAnimations.delete(el)
}


const runAnimation = (el, keyframes, duration, show) => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) duration = 0

	const animation = el.animate(keyframes, { duration, easing: 'ease' })

	runningAnimations.set(el, { animation, show })

	return animation.finished.then(() => {
		runningAnimations.delete(el)

		if (!show) el.style.display = 'none'

		return true
	}, () => false)
}


const isShowing = el => {
	const running = runningAnimations.get(el)

	return running ? running.show : !isHidden(el)
}


const slideDown = (el, duration = 300) => {
	const hidden = isHidden(el),
		from = hidden ? BOX_ZERO : getBoxState(el)

	stopAnimation(el)

	if (hidden) showElement(el)

	const to = getBoxState(el)

	return runAnimation(el, [
		{ ...from, overflow: 'hidden', boxSizing: 'border-box' },
		{ ...to, overflow: 'hidden', boxSizing: 'border-box' }
	], duration, true)
}


const slideUp = (el, duration = 300) => {
	if (isHidden(el)) return Promise.resolve(true)

	const from = getBoxState(el)

	stopAnimation(el)

	// Keep the element visible during the animation, even if CSS hides it by a class
	el.style.display = getComputedStyle(el).display

	return runAnimation(el, [
		{ ...from, overflow: 'hidden', boxSizing: 'border-box' },
		{ ...BOX_ZERO, overflow: 'hidden', boxSizing: 'border-box' }
	], duration, false)
}


const slideToggle = (el, duration = 300) => isShowing(el)
	? slideUp(el, duration)
	: slideDown(el, duration)


const fadeIn = (el, duration = 300) => {
	const hidden = isHidden(el),
		from = hidden ? 0 : getComputedStyle(el).opacity

	stopAnimation(el)

	if (hidden) showElement(el)

	const to = getComputedStyle(el).opacity

	return runAnimation(el, [{ opacity: from }, { opacity: to }], duration, true)
}


const fadeOut = (el, duration = 300) => {
	if (isHidden(el)) return Promise.resolve(true)

	const from = getComputedStyle(el).opacity

	stopAnimation(el)

	el.style.display = getComputedStyle(el).display

	return runAnimation(el, [{ opacity: from }, { opacity: 0 }], duration, false)
}


const fadeToggle = (el, duration = 300) => isShowing(el)
	? fadeOut(el, duration)
	: fadeIn(el, duration)



// Accordion: opens/closes one item
const toggleAccordionItem = (item, open, duration = 300) => {
	const data = item.querySelector(':scope > .hidden')

	// The animation starts before the class changes: slideUp keeps the element visible until the end
	open
		? slideDown(data, duration)
		: slideUp(data, duration)

	item.classList.toggle('active', open)
}
