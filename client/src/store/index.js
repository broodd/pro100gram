import Vue from "vue";
import Vuex from "vuex";
import card from "./card";
import user from "./user";
import shared from "./shared";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
	actions: {},
	modules: {
		user,
		shared,
		card
	}
});

export default store;