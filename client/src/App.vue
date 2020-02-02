<template>
  <v-app id="app">
    <v-navigation-drawer v-if="userId" v-model="drawer" app dark temporary>
      <!-- color="grey lighten-4" -->
      <v-list dense class="pt-0">
        <!-- class="grey lighten-4" -->
        <div>
          <v-img
            :src="
              user.profile.img
                ? user.profile.img
                : `https://api.adorable.io/avatars/285/${user.email}.png`
            "
          ></v-img>

          <v-subheader class="avatar__sub">
            {{ user.profile.name }}
          </v-subheader>
        </div>
        <template v-for="(item, i) in items">
          <v-divider v-if="item.divider" :key="i" dark class="my-4" />
          <v-list-item v-else :key="i" link :to="item.to">
            <v-list-item-action>
              <v-icon>mdi-{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item link @click="onLogOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              Log out
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="userId" app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/">
          <span class="black--text ml-3 mr-5"
            ><span class="font-weight-light">Pro100</span>&nbsp;<span
              class="font-weight-medium"
              >Gram</span
            ></span
          >
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        class="d-none d-sm-flex"
        v-for="link in links"
        :key="link.title"
        :to="link.url"
        text
      >
        <template v-if="link.icon">
          <v-icon left>mdi-{{ link.icon }}</v-icon>
          <span>{{ link.text }}</span>
        </template>
      </v-btn>

      <v-btn class="d-none d-sm-flex" v-if="userId" @click="onLogOut" text>
        <v-icon left>mdi-logout</v-icon>
        <span>Log out</span>
      </v-btn>
    </v-app-bar>

    <!-- <v-progress-linear 
		<!-- <v-progress-linear 
    <!-- <v-progress-linear 
      v-if="loading"
      color="primary" 
      height="2" 
      indeterminate
    ></v-progress-linear> -->

    <v-content>
      <router-view></router-view>
    </v-content>

    <Simpsons></Simpsons>

    <!-- error -->
    <template v-if="error">
      <v-snackbar
        :timeout="4000"
        :multi-line="true"
        :color="error.color || 'error'"
        :value="true"
        bottom
        right
      >
        {{ error.msg || error }}
        <!-- <v-btn flat dark @click.native="closeError">Close</v-btn> -->
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
import store from '@/store';
import router from '@/router';

import Simpsons from '@/components/Simpsons';

export default {
  name: 'App',

  components: {
    Simpsons
  },

  computed: {
    loading() {
      return store.getters.loading;
    },
    error() {
      return store.getters.error;
    },
    userId() {
      return store.getters.userId;
    },
    user() {
      return store.getters.user;
    }
  },

  data: () => ({
    offsetTop: 0,
    drawer: false,
    items: [
      { icon: 'plus-circle', text: 'Add card', to: '/create' },
      { divider: true }
      // { icon: 'touch_app', text: 'Reminders' },
      // { icon: 'add', text: 'Create new label' },
      // { divider: true },
      // { icon: 'archive', text: 'Archive' },
      // { icon: 'delete', text: 'Trash' },
      // { divider: true },
      // { icon: 'settings', text: 'Settings' },
      // { icon: 'chat_bubble', text: 'Trash' },
      // { icon: 'help', text: 'Help' },
      // { icon: 'phonelink', text: 'App downloads' },
      // { icon: 'keyboard', text: 'Keyboard shortcuts' },
    ],
    links: [
      {
        text: 'Add card',
        url: '/create',
        icon: 'plus-circle'
      }
    ]
  }),

  methods: {
    onLogOut() {
      store
        .dispatch('setUser', {
          token: '',
          userId: '',
          user: undefined
        })
        .then(() => {
          router.push('/auth');
        });
    }
  }
};
</script>

<style lang="sass">
@import './assets/sass/style.sass'
</style>
