$(function () {
	const API_URL = 'https://11b6-109-195-118-245.ngrok-free.app/user/334298435'
	const NEXT_URL =
		'https://11b6-109-195-118-245.ngrok-free.app/user/334298435/next' // Updated URL for dislike

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

	// Функция для отправки GET-запроса на сервер при нажатии на dislike
	function sendDislike() {
		fetch(NEXT_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.json()
			})
			.then(data => {
				console.log('Success:', data)
				// Update the HTML elements with the new data
				updateUserInfo(data)
			})
			.catch(error => {
				console.error('Error sending dislike:', error)
			})
	}

	// Логика для открытия match.html
	document
		.querySelector('.btn__box--dislike-link')
		.addEventListener('click', function (e) {
			e.preventDefault()
			sendDislike() // Send the dislike GET request
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
				// Показать бургер-меню
				burgerMenu.style.display = 'block'
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
				// Показать бургер-меню
				burgerMenu.style.display = 'block'
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

	// Функция для обновления информации о пользователе на странице
	function updateUserInfo(data) {
		document.querySelector('.main__info--name').textContent = data.name || ''
		document.querySelector('.main__info--desc').textContent = data.about || ''
	}

	// Функция для заполнения input полей данными с сервера
	function fetchUserData() {
		fetch(API_URL)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.json()
			})
			.then(data => {
				console.log(data) // Добавьте это для отладки
				document.getElementById('name').value = data.name || ''
				document.getElementById('about').value = data.about || ''
				document.getElementById('avatar_url').value = data.avatar_url || ''
				document.getElementById('spotify_login').value =
					data.spotify_login || ''
				document.getElementById('spotify_password').value =
					data.spotify_password || ''

				// Update the HTML elements with the fetched data
				updateUserInfo(data)
			})
			.catch(error => {
				console.error('Error fetching user data:', error)
			})
	}

	// Функция для отправки POST-запроса на сервер для обновления данных
	function updateUserData() {
		const userData = {
			name: document.getElementById('name').value,
			about: document.getElementById('about').value,
			avatar_url: document.getElementById('avatar_url').value,
			spotify_login: document.getElementById('spotify_login').value,
			spotify_password: document.getElementById('spotify_password').value,
		}

		fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.json()
			})
			.then(data => {
				console.log('Success:', data)
				alert('Данные успешно обновлены')
			})
			.catch(error => {
				console.error('Error updating user data:', error)
				alert('Ошибка при обновлении данных')
			})
	}

	// Вызов функции для заполнения input полей при загрузке страницы
	fetchUserData()

	// Добавление обработчика событий для кнопки сохранения данных
	document
		.getElementById('saveButton')
		.addEventListener('click', updateUserData)
})
