import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import * as directives from "vuetify/es5/directives";
// import { scroll } from "vuetify/es5/directives";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		// dark: true,
		themes: {
			light: {
				primary: '#ffc107', // amber
				secondary: "#CDD3DA",
				accent: "#82B1FF",
				error: "#D73222",
				info: '#2196F3',
				success: '#35A65F',
				warning: '#FE8A7D',
			}
		}
	},
	icons: {
		iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
  directives
  // directives: {
  //   scroll
  // }
});
