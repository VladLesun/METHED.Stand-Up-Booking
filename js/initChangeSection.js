import { createComedianBlock } from './comedians';

export const initChangeSection = (
	event,
	eventButtons,
	eventButtonReserve,
	eventButtonEdit,
	booking,
	bookingTitle,
	bookingForm,
	comedians,
	bookingComediansList
) => {
	eventButtons.style.transition = 'opacity 0.5s, visibility 0.5s';

	eventButtons.classList.remove('event__buttons_hidden');

	const changeSection = () => {
		event.classList.toggle('event__hidden');
		booking.classList.toggle('booking__hidden');

		if (!booking.classList.contains('booking__hidden')) {
			const comedianBlock = createComedianBlock(
				comedians,
				bookingComediansList
			);
			bookingComediansList.append(comedianBlock);
		}
	};

	eventButtonReserve.addEventListener('click', () => {
		changeSection();
		bookingTitle.textContent = 'Забронируйте место в зале';
		bookingForm.method = 'POST';
	});
	eventButtonEdit.addEventListener('click', () => {
		changeSection();
		bookingTitle.textContent = 'Редактирование брони';
		bookingForm.method = 'PATCH';
	});

	return changeSection;
};
