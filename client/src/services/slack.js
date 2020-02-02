import api from '@/services/api';

export default {
	getChannels (params) {
    return api().get('slack/channels/list', params);
  },
  getUserByAccessToken (params)  {
    return api().get(`slack/user/${params.accessToken}`, params);
  }
};