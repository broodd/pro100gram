<template>
  <v-container class="h-100">
    <div class="auth d-flex align-center">
      <v-layout row wrap align-stretch justify-center>
        <v-flex xs12 class="hidden-md-and-up text-center mb-3">
          <v-btn type="submit" text rounded large @click="state = !state"
            >Sign up / Sign in</v-btn
          >
        </v-flex>

        <v-flex xs4 class="auth__toggle hidden-sm-and-down" pa-0>
          <v-card
            dark
            class="bg-gra-primary elevation-0 d-flex align-center h-100"
          >
            <v-card-text class="text-center">
              <!-- <img src="@/assets/watch.svg" class="mb-5"> -->
              <h2 class="fz-40">{{ greeting.title }}</h2>
              <p class="font-weight-light mt-3 mb-4">{{ greeting.under }}</p>
              <v-btn outlined rounded large @click="state = !state"
                >Sing {{ state ? "up" : "in" }}</v-btn
              >
							
							<div class="mt-6">
								<a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=311875214820.899634136933"><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
							</div>
            </v-card-text>
          </v-card>
        </v-flex>
				
				

        <transition name="flip">
          <v-flex v-if="state" key="in" sm6 lg4 pa-0>
            <v-card class="elevation-6 h-100 d-flex align-center">
              <v-card-text class="text-center">
                <h2 class="fz-40 primary--text">Sing in</h2>
                <p class="font-weight-light mt-3 mb-4">Use your email for login</p>

                <v-form
                  v-model="valid"
                  ref="formLog"
                  validation
                  @submit.prevent="onLogin"
                  id="form-log"
                >
                  <v-text-field
                    filled
                    prepend-inner-icon="mdi-at"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                    validate-on-blur
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    filled
                    prepend-inner-icon="mdi-key-variant"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="passwordRules"
                    validate-on-blur
                  ></v-text-field>
                </v-form>
                <v-btn
                  rounded
                  large
                  text
                  :loading="loading"
                  type="submit"
                  form="form-log"
                >Sing in</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-else key="out" sm6 lg4 pa-0>
            <v-card class="elevation-6 h-100 d-flex align-center">
              <v-card-text class="text-center">
                <h2 class="fz-40 primary--text">Create Account</h2>
                <p class="font-weight-light mt-3 mb-4">Use your email for registration</p>

                <v-form
                  v-model="valid"
                  ref="formReg"
                  validation
                  @submit.prevent="onRegistration"
                  id="form-reg"
                >
                  <!-- <v-avatar
                    class="mb-3 elevation-7"
                    :tile="false"
                    :size="120"
                  >
                    <img :src="`https://api.adorable.io/avatars/200/${email}.png`" alt="avatar" />
                  </v-avatar> -->

                  <v-text-field
                    filled
                    prepend-inner-icon="mdi-account"
                    name="name"
                    label="Name"
                    type="text"
                    v-model="name"
                    :rules="[v => !!v || 'Name is required']"
                    validate-on-blur
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    filled
                    prepend-inner-icon="mdi-at"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    filled
                    prepend-inner-icon="mdi-key-variant"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="passwordRules"
                    validate-on-blur
                  ></v-text-field>
                </v-form>
                <v-btn
                  rounded
                  large
                  text
                  :loading="loading"
                  type="submit"
                  form="form-reg"
                  >Sing up</v-btn
                >
              </v-card-text>
            </v-card>
          </v-flex>
					
        </transition>
					<v-flex xs12></v-flex>

					<v-flex sm6 lg4 class="mt-6 hidden-md-and-up">
						<a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=311875214820.899634136933"><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
					</v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
import store from '@/store';
import router from '@/router';
import AuthService from '@/services/auth';

export default {
  data() {
    return {
      state: false,

      valid: false,

      name: "",
      email: "",
      password: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => emailRegex.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length >= 6) ||
          "Password must be equal or more than 6 characters"
      ]
    };
  },
  computed: {
    greeting() {
      if (this.state) {
        return {
          title: "Welcome Back!",
          under: "To keep connected with us please login with personal info"
        };
      } else {
        return {
          title: "Hello Friend!",
          under: "Enter your personal details and start journey with us"
        };
      }
    },
    loading() {
      return store.getters.loading;
    }
  },
  methods: {
    async onLogin() {
      if (this.$refs.formLog.validate()) {
        try {
          const response = await AuthService.login({
            email: this.email,
            password: this.password
          });

          if (response.data.data) {
						store
							.dispatch("setUser", {
								token: response.data.token,
								userId: response.data.data._id,
								user: response.data.data
							})
							.then(() => router.push('/'))
					}
        } catch (e) {}
      }
    },
    async onRegistration() {
      if (this.$refs.formReg.validate()) {
				try {
					const response = await AuthService.signUp({
						name: this.name,
						email: this.email,
						password: this.password
					});
			
					if (response.data.data) {
						store
							.dispatch("setUser", {
								token: response.data.token,
								userId: response.data.data._id,
								user: response.data.data
							})
							.then(() => router.push('/'))
					}
				} catch (e) {}
      }
    },
  },
  created() {
    if (this.$route.query["loginError"]) {
      store.dispatch("setError", "Please log in to access");
    }
  }
};
</script>

<style lang="sass">
// @import '@/assets/sass/_mixins.sass'

.auth
  perspective: 1000px
  min-height: 100%
  // perspective-origin: right
  &__toggle
    position: relative
    z-index: 2
    min-height: 460px
    .v-card__text
      padding-left: torem(50)
      padding-right: torem(50)

  // btn
  .v-btn
    padding: 0 50px
    text-transform: uppercase
    // background-image: linear-gradient(to right top, #3aaf9f, #3aaf9f, #3aaf9f, #3aaf9f, #3aaf9f)
    background-image: linear-gradient(to right top, #3aaf9f, #3aaf9f, #3aaf9f, #3aaf9f, #3aaf9f)
    // background-image: linear-gradient(to right top, #ffc107, #c9ca2d, #98cb54, #6dc878, #4cc196)
    color: #fff !important
  
// inputs
// .v-text-field--filled > .v-input__control > .v-input__slot
//   &:before, &:after
//     display: none


.flip
  &-enter
    // transform: translateX(-100%)
    &-active
      animation: flipX 400ms linear
      transform-origin: left
      // position: absolute

  &-leave
    &-active
      // animation: flipXOut 0.3s linear
      // transform-origin: left
      display: none


@keyframes flipX
  from
    transform: rotateY(-45deg)
  to
    transform: rotateY(0deg)

@keyframes flipXOut
  from
    transform: rotateY(0deg)
  to
    transform: rotateY(-45deg)
</style>
