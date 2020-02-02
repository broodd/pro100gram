import api from '@/services/api';

export default {
	toVote (params) {
		return api().post(`cards/poll/${params.id}`);
	}
};