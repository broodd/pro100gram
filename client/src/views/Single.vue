<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 sm10 md8 lg7 v-if="!card && loading">
				<v-skeleton-loader
					type="card-avatar"
					class="mb-3"
				></v-skeleton-loader>
      </v-flex>
      <v-flex xs12 sm10 md8 lg7 v-if="card">
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
  name: "single",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    Card
  },
	computed: {
    card () {
      return store.getters.cardById(this.id);
    },
		loading () {
			return store.getters.loading;
    }
	},
  methods: {},
  created () {
    // TODO: find in state first, else get
    if (!this.card) {
      store.dispatch('getCard', this.id)
    }
  }
};
</script>
