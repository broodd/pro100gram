<template>
  <v-card
    class="mx-auto mt-3"
    :disabled="card.closed"
  >
    <CardImages 
      :images="card.images" 
      :edit="edit"
      @changeImages="onChangeImages"
    />

    <v-card-actions class="grey lighten-3 mb-2">
      <v-list-item>
        <template 
          v-if="card.author"
        >
          <v-list-item-avatar
            size="50"
          >
            <v-img
              class="elevation-4"
              :src="card.author.profile.img ? card.author.profile.img : `https://api.adorable.io/avatars/100/${card.author.email}.png`"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="primary--text">{{ card.author.profile.name }}</v-list-item-title>
            <div class="caption">{{ card.createdAt | formatDate }}</div>
          </v-list-item-content>
        </template>

        <v-row
					v-if="card.author._id == userId"
          align="center"
          justify="end"
        >
					<v-btn
            text
            icon
            fab
            small
            color="accent"
            @click="toggleEdit"
						:loading="loading"
          >
            <v-icon>{{ edit ? 'mdi-close-circle' : 'mdi-pencil' }}</v-icon>
          </v-btn>
					<v-menu 
						bottom
						left
						offset-y
						close-on-click
					>
						<template v-slot:activator="{ on }">
							<v-btn small text icon fab v-on="on" class="ml-3" color="error">
								<v-icon>mdi-dots-horizontal</v-icon>
							</v-btn>
						</template>

						<v-list>
							<v-list-item
								@click="updateCard({ closed: true })"
							>
								<v-list-item-title>Close card</v-list-item-title>
							</v-list-item>
							<v-list-item
								@click="deleteCard"
							>
								<v-list-item-title>Delete card</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
        </v-row>
      </v-list-item>
    </v-card-actions>

    <router-link
      v-if="!edit" 
      :to="`/card/${card._id}`"
    >
      <v-card-title class="pt-0">
        {{ card.title }}
        <v-icon right color="primary">mdi-open-in-new</v-icon>
      </v-card-title>
    </router-link>
    <v-card-title v-else class="pt-0">
      <v-text-field
        filled
        single-line
        v-model="card.title"
        :rules="[v => !!v || 'Require title']"
      ></v-text-field>
        <!-- @blur="updateCard({ title: card.title })" -->
    </v-card-title>

    <template v-if="card.type == 'order'">
      <v-divider></v-divider>
      <v-card-title>
        <div>Delivery</div>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="card.delivery"
          @blur="updateCard({ delivery: card.delivery })"
          :disabled="card.author._id != userId"
          suffix="uah."
          dense
          hide-details
          style="max-width:100px"
					type="number"
					:rules="[v => v >= 0 || 'Must be more 0']"
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>
      <v-card-title>
        <div>Total price</div>
        <v-spacer></v-spacer>
        <div>{{ totalPrice }} uah.</div>
      </v-card-title>

      <CardOrder v-for="order in card.orders" :key="order._id" :order="order" :deliveryEach="deliveryEach" :cardAuthorId="card.author._id"/>

      <v-divider></v-divider>
      <v-card-title>
        <div>Your order</div>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="orderText"
          filled
          label="New order"
          @keydown.enter.prevent="newOrder()"
        ></v-text-field>
        <v-btn
					v-if="orderText"
          color="primary"
          outlined
          @click="newOrder()"
        >Send</v-btn>
      </v-card-text>
    </template>

		<template v-if="card.type == 'poll'">
			<v-divider></v-divider>
			<v-card-title>
        <div>Total votes</div>
        <v-spacer></v-spacer>
        <div>{{ totalVotes }}</div>
      </v-card-title>

      <CardPolls :polls="card.polls" :anonime="card.anonime" :totalVotes="totalVotes" :defaultPollSelect="card.pollSelected"/>
		</template>

  </v-card>
</template>

<script>
import store from '@/store';

import OrderService from '@/services/order';
import CardService from '@/services/card';

import CardOrder from '@/components/CardOrder';
import CardImages from '@/components/CardImages';
import CardPolls from '@/components/CardPolls';

export default {
  name: 'card',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  components: {
		CardOrder,
    CardImages,
    CardPolls
  },

  data: () => ({
		orderText: '',
		// pollSelect: undefined,
    edit: false,
		loading: false,
		imagesFiles: []
  }),
  computed: {
    deliveryEach () {
			if (this.card.type == 'order') {
				return Number((this.card.delivery / this.card.orders.length).toFixed(2));
			}
			return 0;
    },
    totalPrice () {
			if (this.card.type == 'order') {
				return this.card.orders.reduce((accumulator, currentValue) => {
					return accumulator + +currentValue.price;
        }, (+this.card.delivery || 0))
      }
      return 0;
    },
		totalVotes () {
			if (this.card.type == 'poll') {
				return this.card.polls.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.votes.length;
        }, 0)
			}
			return 0;
		},
    userId () {
      return store.getters.userId;
    }
  },
  filters: {
    formatDate(value) {
      const now = new Date();
      const time = new Date(value);
      const diff = now.getTime() - time.getTime();

      if (diff < 60) { // it happened now
        return 'now';
      } else if (diff < 3600) { // it happened X minutes ago
        const m = Math.round( diff / 60 );
        return m == 1 ? `${m} minute ago` : `${m} minutes ago`;
      } else if (diff < 3600 * 24) { // it happened X hours ago
        const m = Math.round( diff / 3600 );
        return m == 1 ? `${m} hour ago` : `${m} hours ago`;
      } else if (diff < 3600 * 24 * 2) { // it happened yesterday
        return `yesterday`
      } else { // falling back on a usual date format as it happened later than yesterday
        return time.getFullYear() == now.getFullYear() ? time.toString().slice(4, 10) : time.toString().slice(4,15);
      }
    }
  },
  methods: {
		async toggleEdit () {
			try {
				if (this.card.title) {
					if (this.edit) {
						this.updateCard({
							title: this.card.title,
              images: this.card.images ? this.card.images : false
						})	
					}

					this.edit = !this.edit;
				}
			} catch (e) {
				store.dispatch('setError', e);
			}
		},
    async updateCard (params) {
      try {
				this.loading = true;
        const card = await CardService.updateCard({
          id: this.card._id,
          ...params
        });

        // if (params.title) {
        //   this.$set(this.card, 'title', card.data.data.title);
        // }
        // if (params.closed) {
        //   this.$set(this.card, 'closed', true);
        // }
        // if (params.delivery) {
        //   this.$set(this.card, 'delivery', card.data.data.delivery);
        // }
        // if (params.anonime) {
        //   this.$set(this.card, 'anonime', card.data.data.anonime);
        // }

				this.edit = false;
				this.loading = false;
      } catch (e) {
				this.loading = false;
        store.dispatch('setError', e)
      }
    },
    async deleteCard () {
      try {
        const order = await CardService.deleteCard({
          id: this.card._id
        });

        // this.card.closed = true;
        // store.dispatch('deleteCard', this.card._id);
      } catch (e) {}
    },
    async newOrder () {
      try {
        const order = await OrderService.newOrder({
          id: this.card._id,
          text: this.orderText
        });

        if (order.data.data) {
          // this.card.orders.push(order.data.data);
          this.orderText = '';
        }
      } catch (e) {}
		},
    onChangeImages (images) {
      this.$set(this.card, 'images', images);
    }
	}
};
</script>
