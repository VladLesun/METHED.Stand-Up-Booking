import { Notification } from './js/notification';
import './style.css';
import TomSelect from 'tom-select';
import Inputmask from 'inputmask';
import JustValidate from 'just-validate';
import inputmask from 'inputmask';

// API
const API_URL = 'http://localhost:3214';
const API_COMEDIANS = '/comedians';

const MAX_COMEDIANS = 6;
const bookingComediansList = document.getElementById('booking-comedians-list');
const bookingForm = document.getElementById('booking-form');

const notification = Notification.getInstance();

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

	const comedianBlock = createComedianBlock(comedians);
	bookingComediansList.append(comedianBlock);

	const validate = new JustValidate(bookingForm, {
		errorFieldCssClass: 'booking__input_invalid',
		successFieldCssClass: 'booking__input_valid',
	});

	const bookingInputFullnamne = document.querySelector(
		'.booking__input_fullname'
	);
	const bookingInputPhone = document.querySelector('.booking__input_phone');
	const bookingInputTicket = document.querySelector('.booking__input_ticket');

	new inputmask('+375(99) 999-99-99').mask(bookingInputPhone);
	new inputmask('99999999').mask(bookingInputTicket);

	validate
		.addField(bookingInputFullnamne, [
			{ rule: 'required', errorMessage: 'Введите, Ваше, имя и фамилию' },
		])
		.addField(bookingInputPhone, [
			{ rule: 'required', errorMessage: 'Введите, Ваш, номер телефона' },
			{
				validator() {
					const phone = bookingInputPhone.inputmask.unmaskedvalue();
					return phone.length === 9 && !!Number(phone);
				},
				errorMessage: 'Некорректный номер телефона',
			},
		])
		.addField(bookingInputTicket, [
			{ rule: 'required', errorMessage: 'Введите, Ваш, номер билета' },
			{
				validator() {
					const ticket = bookingInputTicket.inputmask.unmaskedvalue();
					return ticket.length === 8 && !!Number(ticket);
				},
				errorMessage: 'Неверный номер билета',
			},
		])
		.onFail((fields) => {
			let errorMessage = '';

			for (const key in fields) {
				if (!Object.hasOwnProperty.call(fields, key)) {
					continue;
				}

				const element = fields[key];
				if (!element.isValid) {
					errorMessage += `${element.errorMessage}, `;
				}

				notification.show(errorMessage, false);
			}
		});

	bookingForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const data = { booking: [] };
		const times = new Set();

		new FormData(bookingForm).forEach((value, field) => {
			if (field === 'booking') {
				const [comedian, time] = value.split(',');

				if (comedian && time) {
					data.booking.push({ comedian, time });
					times.add(time);
				}
			} else {
				data[field] = value;
			}

			if (times.size !== data.booking.length) {
				notification.show(
					'Нельзя быть в одно время на двух выступлениях',
					false
				);
			}
		});
	});
};

init();
