import axios from 'axios';
import store from '@/store';
import router from '@/router';


export default () => {
	const token = store.getters.token

	const apiClient = axios.create({
		baseURL: 'https://pro100gram.herokuapp.com',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token || undefined
		},
	});

	apiClient.interceptors.request.use((config) => {
		store.dispatch('setLoading', true);
		store.dispatch('setError', '');
		return config;
	}, function (error) {
		return Promise.reject(error);
	});


	apiClient.interceptors.response.use(response => {
		store.dispatch('setLoading', false);
		return Promise.resolve(response);
	},
		error => {
			if (error.response) {
				if (error.response.status === 404) {
					router.push('/404')
				}
				if (error.response.status === 401) {
					store.dispatch('setUser', {
						token: '',
						userId: ''
					})

					router.push({ path: 'auth', query: { loginError: '' } })
				}
				store.dispatch('setLoading', false);
				store.dispatch('setError', error.response.data.message);
				return Promise.reject(error);
			} else {
				alert(error);
			}
		});

	return apiClient;
};