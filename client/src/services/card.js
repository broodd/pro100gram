import api from '@/services/api';

export default {
	getCard (params) {
    return api().get(`cards/${params.id}`, { params });
	},
	getCards (params) {
		return api().get('cards', { params });
	},
  createCard (params) {
    return api().post('cards', params);
  },
  updateCard (params) {
    return api().put(`cards/${params.id}`, params);
  },
  deleteCard (params) {
    return api().delete(`cards/${params.id}`);
  }
};