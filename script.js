$(function () {
	const burgerMenu = document.querySelector('.burger')
	const overlay = document.querySelector('.overlay')
	const body = document.body
	const sidebar = document.querySelector('.sidebar')
	const matchPage = document.getElementById('matchPage')
	let startY = 0
	let isSwiping = false

	// Функция для переключения меню и overlay
	function toggleMenu() {
		body.classList.toggle('menu-opened')
	}

	// Открытие меню и overlay при клике на бургер
	burgerMenu.addEventListener('click', e => {
		e.preventDefault()
		toggleMenu()
	})

	// Закрытие overlay при клике
	overlay.addEventListener('click', () => {
		body.classList.remove('menu-opened')
	})

	// Логика для открытия match.html
	document
		.querySelector('.btn__box--dislike-link')
		.addEventListener('click', function (e) {
			e.preventDefault()
			matchPage.classList.remove('hidden')

			// Load the content of match.html into the div
			fetch('match.html')
				.then(response => response.text())
				.then(data => {
					matchPage.innerHTML = data
					// Add the visible class after the content is loaded
					matchPage.classList.add('visible')

					// Add event listener to the close button
					const closeButton = matchPage.querySelector('.close-button')
					closeButton.addEventListener('click', function (e) {
						e.preventDefault()
						matchPage.classList.remove('visible')
						setTimeout(() => {
							matchPage.classList.add('hidden')
						}, 500) // Скрыть через 0.5 секунды после анимации
					})
				})
		})

	// Обработчик событий для свайпа вниз
	matchPage.addEventListener('touchstart', e => {
		startY = e.touches[0].clientY
		isSwiping = true
	})

	matchPage.addEventListener('touchmove', e => {
		if (!isSwiping) return
		const currentY = e.touches[0].clientY
		const diffY = startY - currentY

		if (diffY > 50) {
			// Если свайп вниз больше 50 пикселей
			matchPage.classList.remove('visible')
			setTimeout(() => {
				matchPage.classList.add('hidden')
			}, 500) // Скрыть через 0.5 секунды после анимации
			isSwiping = false
		}
	})

	matchPage.addEventListener('touchend', () => {
		isSwiping = false
	})

	// Обработчик событий для свайпа вниз на десктопе
	matchPage.addEventListener('mousedown', e => {
		startY = e.clientY
		isSwiping = true
	})

	matchPage.addEventListener('mousemove', e => {
		if (!isSwiping) return
		const currentY = e.clientY
		const diffY = startY - currentY

		if (diffY > 50) {
			// Если свайп вниз больше 50 пикселей
			matchPage.classList.remove('visible')
			setTimeout(() => {
				matchPage.classList.add('hidden')
			}, 500) // Скрыть через 0.5 секунды после анимации
			isSwiping = false
		}
	})

	matchPage.addEventListener('mouseup', () => {
		isSwiping = false
	})

	// Функция для установки уровня заполнения кнопки и обновления текста с процентами
	function setCircleHeight(percent) {
		const circle = document.querySelector('.circle')
		const percentText = document.querySelector('.percent-text')
		const translateY = 100 - percent
		circle.style.transform = `translateY(${translateY}%)`
		percentText.textContent = `${percent}%`
	}

	// Пример использования: установить уровень заполнения на 50%
	setCircleHeight(50)
})
