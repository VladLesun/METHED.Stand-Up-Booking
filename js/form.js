import JustValidate from 'just-validate';
import inputmask from 'inputmask';
import { Notification } from './notification';
import { sendData } from './api';

export const initForm = (
	bookingForm,
	bookingInputFullnamne,
	bookingInputPhone,
	bookingInputTicket,
	changeSection,
	bookingComediansList
) => {
	const validate = new JustValidate(bookingForm, {
		errorFieldCssClass: 'booking__input_invalid',
		successFieldCssClass: 'booking__input_valid',
	});

	new inputmask('+375(99) 999-99-99').mask(bookingInputPhone);
	new inputmask('99999999').mask(bookingInputTicket);

	validate
		.addField(bookingInputFullnamne, [
			{ rule: 'required', errorMessage: 'Введите имя и фамилию' },
		])
		.addField(bookingInputPhone, [
			{ rule: 'required', errorMessage: 'Введите номер телефона' },
			{
				validator() {
					const phone = bookingInputPhone.inputmask.unmaskedvalue();
					return phone.length === 9 && !!Number(phone);
				},
				errorMessage: 'Некорректный номер телефона',
			},
		])
		.addField(bookingInputTicket, [
			{ rule: 'required', errorMessage: 'Введите номер билета' },
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

				Notification.getInstance().show(errorMessage.slice(0, -2), false);
			}
		});

	bookingForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		if (!validate.isValid) {
			return;
		}

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
		});
		if (times.size !== data.booking.length) {
			Notification.getInstance().show(
				'Нельзя быть в одно время на двух выступлениях',
				false
			);
			return;
		}

		if (!times.size) {
			Notification.getInstance().show('Вы не выбрали комика и/или время');
			return;
		}

		const method = bookingForm.getAttribute('method');

		let isSend = false;

		if (method === 'PATCH') {
			isSend = await sendData(method, data, data.ticketNumber);
		} else {
			isSend = await sendData(method, data);
		}

		if (isSend) {
			Notification.getInstance().show('Бронь принята', true);
			changeSection();
			bookingForm.reset();
			bookingComediansList.textContent = '';
		}

		console.log(data);
	});
};
