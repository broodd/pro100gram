import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false;
Vue.config.silent = false;

// Global mixins
// import loading from '@/mixins/loading';
// Vue.mixin(loading);

Vue.use(new VueSocketIO({
	debug: true,
	connection: 'https://pro100gram.herokuapp.com',
	vuex: {
		store,
		actionPrefix: "SOCKET_",
		mutationPrefix: "SOCKET_"
	}
}));

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount("#app");
