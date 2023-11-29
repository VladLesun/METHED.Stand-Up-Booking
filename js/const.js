import { getComedians } from './api';

//! Кол-во комиков на главном экране
export const countComedians = document.getElementById('count-comedians');

//! Форма
export const bookingForm = document.getElementById('booking-form');
export const bookingInputFullnamne = document.querySelector(
	'.booking__input_fullname'
);
export const bookingInputPhone = document.querySelector(
	'.booking__input_phone'
);
export const bookingInputTicket = document.querySelector(
	'.booking__input_ticket'
);
export const bookingComediansList = document.getElementById(
	'booking-comedians-list'
);

//! Переход между экранами
export const event = document.querySelector('.event');
export const eventButtons = document.querySelector('.event__buttons');
export const eventButtonReserve = document.querySelector(
	'.event__button_reserve'
);
export const eventButtonEdit = document.querySelector('.event__button_edit');
export const booking = document.querySelector('.booking');
export const bookingTitle = document.querySelector('.booking__title');
