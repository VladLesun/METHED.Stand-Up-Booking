import TomSelect from 'tom-select';

const MAX_COMEDIANS = 6;

export const createComedianBlock = (comedians, bookingComediansList) => {
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

	//! Селект с комиками, который рендарится из бека
	const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
		hideSelected: true,
		placeholder: 'Выбрать комика',
		options: comedians.map((comedian) => ({
			value: comedian.id,
			text: comedian.comedian,
		})),
	});

	//! Селект с временем, который рендарится из бека
	const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
		hideSelected: true,
		placeholder: 'Время',
	});
	bookingTomSelectTime.disable();

	//! Отображаем время каждого комика
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

	//! Отображаем в каком зале выступает комик
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
			const newComediansBlock = createComedianBlock(
				comedians,
				bookingComediansList
			);
			bookingComediansList.append(newComediansBlock);
		}

		bookingTomSelectTime.off('change', createNextBookingComedian);
	};

	bookingTomSelectTime.on('change', createNextBookingComedian);

	return bookingComedian;
};
