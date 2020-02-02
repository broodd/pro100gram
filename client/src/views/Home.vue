<template>
  <v-container grid-list-md v-scroll="onScroll">
    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 sm10 md8 lg7 v-if="!cards.length && loading">
				<v-skeleton-loader
					type="card-avatar"
					class="mb-3"
				></v-skeleton-loader>
				<v-skeleton-loader
					type="card-avatar"
					class="mb-3"
				></v-skeleton-loader>
      </v-flex>
      <v-flex xs12 sm10 md8 lg7 v-for="card in cards" :key="card._id">
        <Card :card="card"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from '@/store';
import Card from '@/components/Card';
import CardService from '@/services/card';

export default {
  name: "home",
  components: {
    Card
  },
  data () {
    return {
      // cards: []
      // offsetTop: 0,
      page: 1
    }
	},
	computed: {
		loading () {
			return store.getters.loading;
    },
    cards () {
      return store.getters.cards;
    }
	},
  methods: {
    onNextPageCards (page) {
      this.loadCards(page);
    },
    onScroll () {
      if (this.loading) return;

      const scrollTop = document.documentElement.scrollTop + window.innerHeight;
      const appHeight = document.getElementById('app').offsetHeight.toFixed(0);

      if (scrollTop == appHeight) {
        this.page++;
        store.dispatch('getCards', this.page);
      }
      
    },
  },
  created () {
    // this.loadCards();
    if (!this.cards.length <= 1)
      store.dispatch('getCards');
  }
};
</script>
