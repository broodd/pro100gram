<template>
  <div>
    <v-divider></v-divider>

    <v-card-actions>
      <v-layout row>
        <v-flex xs12>
          <v-list-item>
            <template 
              v-if="order.author"
            >
              <v-list-item-avatar>
                <v-img
                  class="elevation-4"
                  :src="order.author.profile.img ? order.author.profile.img : `https://api.adorable.io/avatars/100/${order.author.email}.png`"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="primary--text">{{ order.author.profile.name }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="order.price"
              :rules="[v => v > 0 || 'Must be more 0']"
              type="number"
              prefix="Price"
              :suffix="` + ${deliveryEach} = ${+order.price + deliveryEach} uah.`"
              :disabled="cardAuthorId != userId || order.closed"
              :hide-details="true"
              style="max-width:250px"
              filled
              dense
              single-line
              @blur="updateOrder({ price: order.price })"
            ></v-text-field>

            <v-menu 
              v-if="order.author._id == userId && !order.closed"
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
                  v-if="cardAuthorId == userId && order.price"
                  @click="updateOrder({ closed: true })"
                >
                  <v-list-item-title>Close order</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="deleteOrder"
                >
                  <v-list-item-title>Delete order</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            auto-grow
            rows="2"
            filled
            single-line
            v-model="order.text"
            :disabled="order.author._id != userId || order.closed"
            :hide-details="true"
            :rules="[v => !!v || 'Require']"
            @blur="updateOrder({ text: order.text })"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </div>
</template>


<script>
import store from '@/store';
import OrderService from '@/services/order';

export default {
  props: {
    order: {
      type: Object,
      required: true
    },
    deliveryEach: {
      type: Number
    },
    cardAuthorId: {
      type: String
    }
  },
  computed: {
    userId () {
      return store.getters.userId;
    }
  },
  methods: {
    async updateOrder (params) {
      try {
        if (!this.order.text) return

        const order = await OrderService.updateOrder({
          id: this.order._id,
          ...params
        });

        // if (params.text) {
        //   this.$set(this.order, 'text', order.data.data.text);
        // }
        // if (params.price) {
        //   this.$set(this.order, 'price', order.data.data.price);
        // }
        // if (params.closed) {
        //   this.$set(this.order, 'closed', order.data.data.closed);
        // }
      } catch (e) {}
    },
    async deleteOrder () {
      try {
        const order = await OrderService.deleteOrder({
          id: this.order._id
        });

        // this.order.closed = true;
      } catch (e) {}
    },
  }
}
</script>