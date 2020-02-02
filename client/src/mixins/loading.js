import store from '@/store';

export default {
	computed: {
		loading () {
			return store.getters.loading
		}
	}
}