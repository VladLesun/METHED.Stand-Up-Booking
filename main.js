import './style.css';
import { getComedians } from './js/api';
import { createComedianBlock } from './js/comedians';
import { initForm } from './js/form';

const init = async () => {
	const bookingComediansList = document.getElementById(
		'booking-comedians-list'
	);
	const countComedians = document.getElementById('count-comedians');
	const bookingForm = document.getElementById('booking-form');
	const bookingInputFullnamne = document.querySelector(
		'.booking__input_fullname'
	);
	const bookingInputPhone = document.querySelector('.booking__input_phone');
	const bookingInputTicket = document.querySelector('.booking__input_ticket');

	const comedians = await getComedians();

	initForm(
		bookingForm,
		bookingInputFullnamne,
		bookingInputPhone,
		bookingInputTicket
	);

	if (comedians) {
		countComedians.textContent = comedians.length;
		const comedianBlock = createComedianBlock(comedians, bookingComediansList);
		bookingComediansList.append(comedianBlock);
	}
};

init();
