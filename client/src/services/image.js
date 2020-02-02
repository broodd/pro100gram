import api from '@/services/api';

export default {
	uploadImages (params) {
		return api().post(`upload`, params);
	}
};