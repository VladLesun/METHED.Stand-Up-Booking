import './style.css';
import TomSelect from 'tom-select';

// API
const API_URL = 'http://localhost:3214';
const API_COMEDIANS = '/comedians';

const MAX_COMEDIANS = 6;
const bookingComediansList = document.getElementById('booking-comedians-list');

const createComedianBlock = (comedians) => {
	const bookingComedian = document.createElement('li'),
		bookingSelectComedian = document.createElement('select'),
		bookingSelectTime = document.createElement('select'),
		inputHidden = document.createElement('input'),
		bookingButton = document.createElement('button');

	bookingComedian.classList.add('booking__comedian');
	bookingSelectComedian.classList.add(
		'booking__select',
		'booking__select_comedian'
	);
	bookingSelectTime.classList.add('booking__select', 'booking__select_time');
	bookingButton.classList.add('booking__hall');

	bookingSelectComedian.name = 'comedian';
	bookingSelectTime.name = 'time';
	inputHidden.type = 'hidden';
	inputHidden.name = 'booking';
	bookingButton.type = 'button';

	bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);

	const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
		hideSelected: true,
		placeholder: 'Выбрать комика',
		options: comedians.map((comedian) => ({
			value: comedian.id,
			text: comedian.comedian,
		})),
	});

	const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
		hideSelected: true,
		placeholder: 'Время',
	});
	bookingTomSelectTime.disable();

	bookingTomSelectComedian.on('change', (id) => {
		bookingTomSelectComedian.blur();
		bookingTomSelectTime.enable();

		const { performances } = comedians.find((comedian) => comedian.id === id);

		bookingTomSelectTime.clear();
		bookingTomSelectTime.clearOptions();
		bookingTomSelectTime.addOptions(
			performances.map((comedian) => ({
				value: comedian.time,
				text: comedian.time,
			}))
		);

		bookingButton.remove();
	});

	bookingTomSelectTime.on('change', (time) => {
		if (!time) {
			return;
		}

		bookingTomSelectTime.blur();

		const idComedian = bookingTomSelectComedian.getValue();
		const { performances } = comedians.find(
			(comedian) => comedian.id === idComedian
		);
		const { hall } = performances.find((comedian) => comedian.time === time);
		inputHidden.value = `${idComedian}, ${time}`;

		bookingButton.textContent = hall;
		bookingComedian.append(bookingButton);
	});

	// ! Создание и добавления еще одного комика
	const createNextBookingComedian = () => {
		if (bookingComediansList.children.length < MAX_COMEDIANS) {
			const newComediansBlock = createComedianBlock(comedians);
			bookingComediansList.append(newComediansBlock);
		}

		bookingTomSelectTime.off('change', createNextBookingComedian);
	};

	bookingTomSelectTime.on('change', createNextBookingComedian);

	return bookingComedian;
};

const getComedians = async () => {
	const response = await fetch(`${API_URL}${API_COMEDIANS}`);
	return response.json();
};

const init = async () => {
	const countComedians = document.getElementById('count-comedians');
	const comedians = await getComedians();
	countComedians.textContent = comedians.length;

	console.log('comedians: ', comedians);

	const comedianBlock = createComedianBlock(comedians);
	bookingComediansList.append(comedianBlock);
};

init();
