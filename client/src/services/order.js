import api from '@/services/api';

export default {
	newOrder (params) {
		return api().post(`cards/${params.id}/order`, params);
	},
  updateOrder (params) {
    return api().put(`cards/order/${params.id}`, params);
  },
  deleteOrder (params) {
    return api().delete(`cards/order/${params.id}`);
  },
};