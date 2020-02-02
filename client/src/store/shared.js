export default {
	state: {
		loading: false,
		error: undefined,
		simpsons: false
	},
	mutations: {
		setLoading(state, payload) {
			state.loading = payload;
		},
		setError(state, payload) {
			state.error = payload;
		},
		setSimpsons(state, payload) {
			state.error = payload;
		}
	},
	actions: {
		setLoading({ commit }, payload) {
			commit("setLoading", payload);
		},
		setError({ commit }, payload) {
			commit("setError", payload);
		},
		setSimpsons({ commit }, payload) {
			commit("setSimpsons", payload);
		}
	},
	getters: {
		loading(state) {
			return state.loading;
		},
		error(state) {
			return state.error;
		},
		simpsons(state) {
			return state.simpsons;
		}
	}
};