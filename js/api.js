import { Notification } from './notification';

const API_URL = 'http://localhost:3214';
const API_COMEDIANS = '/comedians';

export const getComedians = async () => {
	try {
		const response = await fetch(`${API_URL}${API_COMEDIANS}`);
		if (!response.ok) {
			console.error(`Ошибка сервера: ${response.status}`);
		}
		return response.json();
	} catch (error) {
		console.error(`Возникла ошибка с fetch сервера: ${error.message}`);
		Notification.getInstance().show('Ошибка сервера, попробуйте позже...');
	}
};
