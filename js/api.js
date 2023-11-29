import { Notification } from './notification';

const API_URL = 'http://localhost:3214';
const API_COMEDIANS = '/comedians';
const API_CLIENTS = '/clients';

export const getComedians = async () => {
	try {
		const response = await fetch(`${API_URL}${API_COMEDIANS}`);
		if (!response.ok) {
			throw new Error(`Ошибка сервера: ${response.status}`);
		}
		return response.json();
	} catch (error) {
		console.error(`Возникла ошибка с fetch сервера: ${error.message}`);
		Notification.getInstance().show(
			'Возникла ошибка сервера, попробуйте позже...'
		);
	}
};

export const sendData = async (method, data, id) => {
	try {
		const response = await fetch(
			`${API_URL}${API_CLIENTS}${id ? `/${id}` : ''}`,
			{
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			}
		);
		if (!response.ok) {
			throw new Error(`Ошибка сервера: ${response.status}`);
		}
		return true;
	} catch (error) {
		console.error(`Возникла ошибка с fetch сервера: ${error.message}`);
		Notification.getInstance().show(
			'Возникла ошибка сервера, попробуйте позже...'
		);
		return false;
	}
};
