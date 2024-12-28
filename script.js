$(function () {
	const MY_ID = '334298435' // Ваш ID

	const BASE_URL = 'https://2f46-109-195-118-245.ngrok-free.app'
	const MY_PROFILE_API_URL = `${BASE_URL}/user/${MY_ID}`
	const NEXT_URL = `${BASE_URL}/user/${MY_ID}/next` // Updated URL for dislike

	let nextUserId = '' // ID следующего человека

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
	function sendNext() {
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
				nextUserId = data.telegram_id // Сохраняем ID следующего человека
				// Update the HTML elements with the new data
				console.log(nextUserId)
				updateUserInfo(data)
				updateMainPhoto(data.avatar_url)

				updateAlbumPicture(data.album_cover_url)
				setCircleHeight(data.match_percent)
			})
			.catch(error => {
				console.error('Error sending next:', error)
			})
	}

	// Функция для отправки GET-запроса на сервер при нажатии на like
	function sendLike() {
		const LIKE_URL = `${BASE_URL}/likes/${MY_ID}/${nextUserId}`
		console.log(LIKE_URL)
		fetch(LIKE_URL, {
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
				console.log(data)
				updateMainPhoto(data.avatar_url)
			})
			.catch(error => {
				console.error('Error sending like:', error)
			})
	}

	// Логика для открытия match.html
	document
		.querySelector('.btn__box--dislike-link')
		.addEventListener('click', function (e) {
			e.preventDefault()
			sendNext() // Send the next GET request
		})

	// Логика для открытия match.html при нажатии на like
	document
		.querySelector('.btn__box--like-link')
		.addEventListener('click', function (e) {
			e.preventDefault()
			sendLike() // Send the like GET request
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
	// Функция для установки уровня заполнения кнопки и обновления текста с процентами
	function setCircleHeight(percent) {
		const circle = document.querySelector('.circle')
		const percentText = document.querySelector('.percent-text')

		// Округляем процент до целого числа
		const roundedPercent = Math.round(percent)

		// Ограничиваем максимальный балл до 10
		const maxScore = 10
		const finalPercent = Math.min(roundedPercent, maxScore)

		// Вычисляем translateY на основе финального процента
		const translateY = 100 - finalPercent * 10

		// Устанавливаем стиль и текст
		circle.style.transform = `translateY(${translateY}%)`
		percentText.textContent = `${finalPercent}`
	}

	// Пример использования: установить уровень заполнения на 50%
	setCircleHeight(50)

	// Функция для обновления информации о пользователе на странице
	function updateUserInfo(data) {
		document.querySelector('.main__info--name').textContent = data.name || ''
		document.querySelector('.main__info--desc').textContent = data.about || ''
	}

	// Функция для обновления фотографии в main__photo
	function updateMainPhoto(avatarUrl) {
		const mainPhoto = document.getElementById('mainPhoto')
		mainPhoto.src = avatarUrl
	}

	// Функция для заполнения input полей данными с сервера
	function fetchUserData() {
		// Получение настроек пользователя (того кто запустл приложение)
		fetch(MY_PROFILE_API_URL)
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
				//updateUserInfo(data)
				//updateMainPhoto(data.avatar_url)
			})
			.catch(error => {
				console.error('Error fetching user data:', error)
			})

		sendNext()
	}

	// Обновление аватарки альбома связающего хаха лол
	function updateAlbumPicture(album_url) {
		const album_obj = document.getElementById('album__pic')
		album_obj.src = album_url
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

		fetch(MY_PROFILE_API_URL, {
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
