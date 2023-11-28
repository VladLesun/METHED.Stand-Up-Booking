import JustValidate from 'just-validate';
import inputmask from 'inputmask';
import { Notification } from './notification';

export const initForm = (
	bookingForm,
	bookingInputFullnamne,
	bookingInputPhone,
	bookingInputTicket
) => {
	const validate = new JustValidate(bookingForm, {
		errorFieldCssClass: 'booking__input_invalid',
		successFieldCssClass: 'booking__input_valid',
	});

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

				Notification.getInstance().show(errorMessage.slice(0, -2), false);
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
				Notification.getInstance().show(
					'Нельзя быть в одно время на двух выступлениях',
					false
				);
			}
		});
	});
};
