export default {
	state: {
		userId: undefined,
		token: undefined
	},
	mutations: {
		setUser(state, { userId, token, user }) {
			state.userId = userId;
			state.token = token;
			state.user = user;
			localStorage.setItem('gramToken', token)
			localStorage.setItem('gramUserId', userId)
			localStorage.setItem('gramUser', JSON.stringify(user))
		},
	},
	actions: {
		setUser({ commit }, payload) {
			commit('setUser', payload);
		}
	},
	getters: {
		userId(state) {
			return state.userId || localStorage.getItem('gramUserId')
		},
		token(state) {
			return state.token || localStorage.getItem('gramToken')
		},
		user (state) {
			return Object.keys(state.user || {}).length ? state.user : JSON.parse(localStorage.getItem('gramUser'))
		}
	}
}