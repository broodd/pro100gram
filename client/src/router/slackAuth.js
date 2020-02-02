import store from "../store";
import router from "../router";
import SlackServices from "../services/slack";

export default async function (to, from, next) {
  const accessToken = to.params.accessToken;
  if (!accessToken) return next("/auth?loginError=true");

  const res = await SlackServices.getUserByAccessToken({accessToken});

  if (res.data.data) {
    store
      .dispatch("setUser", {
        token: res.data.token,
				userId: res.data.data._id,
				user: res.data.data
      })
      .then(() => {
        router.push('/')
      })
  } else {
    return next("/auth?loginError=true");
  }
}