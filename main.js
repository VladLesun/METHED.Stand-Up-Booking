import './style.css';
import { getComedians } from './js/api';
import { initForm } from './js/form';
import {
	event,
	eventButtons,
	eventButtonReserve,
	eventButtonEdit,
	countComedians,
	booking,
	bookingTitle,
	bookingForm,
	bookingInputFullnamne,
	bookingInputPhone,
	bookingInputTicket,
	bookingComediansList,
} from './js/const';
import { initChangeSection } from './js/initChangeSection';

const init = async () => {
	const comedians = await getComedians();

	if (comedians) {
		countComedians.textContent = comedians.length;

		const changeSection = initChangeSection(
			event,
			eventButtons,
			eventButtonReserve,
			eventButtonEdit,
			booking,
			bookingTitle,
			bookingForm,
			comedians,
			bookingComediansList
		);

		initForm(
			bookingForm,
			bookingInputFullnamne,
			bookingInputPhone,
			bookingInputTicket,
			changeSection,
			bookingComediansList
		);
	}
};

init();
