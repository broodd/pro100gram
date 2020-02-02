import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from "./auth-guard";
import slackAuth from "./slackAuth";

// import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/auth",
    name: "auth",
		component: Auth
	},
  {
    path: "/auth/slack/:accessToken",
    name: "auth.slack",
    beforeEnter: slackAuth
	},
	{
		path: "/",
		name: "home",
		beforeEnter: AuthGuard,
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/Home.vue")
	},
	{
		path: "/create",
		name: "create",
		beforeEnter: AuthGuard,
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/Create.vue")
	},
  {
    path: "/card/:id",
    name: "card",
    props: true,
		beforeEnter: AuthGuard,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Single.vue")
	},
	{
    path: "*",
    redirect: "/"
    // name: '404',
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/404.vue")
	}
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
