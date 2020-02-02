<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 sm10 md8>
        <v-form
          v-model="valid"
          ref="formCreate"
          validation
          @submit.prevent="createCard"
          id="form-create"
        >
          <v-card class="mx-auto">
            <CardImages :images="images" :edit="true" @changeImages="onChangeImages" />

            <v-divider></v-divider>
            <v-card-title>
              <v-textarea
                auto-grow
                rows="2"
                filled
                single-line
                v-model="title"
                placeholder="Card title"
                hide-details
                :rules="[v => !!v || 'Require title']"
              ></v-textarea>
            </v-card-title>

            <v-divider></v-divider>
            <v-card-title>
              <v-radio-group v-model="type" hide-details>
                <v-radio label="Info" value="info" color="primary"></v-radio>
                <v-radio label="Order" value="order" color="primary"></v-radio>
                <v-radio label="Poll" value="poll" color="primary"></v-radio>
              </v-radio-group>
            </v-card-title>

            <template v-if="type == 'order'">
              <v-divider></v-divider>
              <v-card-title>
                <div>Delivery</div>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="delivery"
                  type="number"
                  suffix="uah."
                  dense
                  hide-details
                  :rules="[v => +v >= 0 || 'Must be more 0']"
                  style="max-width:100px"
                ></v-text-field>
              </v-card-title>

              <v-divider></v-divider>
            </template>

            <template v-if="type == 'poll'">
              <v-divider></v-divider>
              <v-card-title>
                <div>Polls</div>
              </v-card-title>

              <v-card-title>
                <v-switch color="primary" v-model="anonime" label="Anonime poll"></v-switch>
              </v-card-title>

              <v-list v-if="polls.length">
                <draggable v-model="polls" draggable=".draggable">
                  <v-list-item v-for="(poll, key) in polls" :key="key" class="draggable poll">
                    <v-list-item-icon>
                      <v-icon>mdi-drag</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <!-- <v-list-item-title v-text="poll"></v-list-item-title> -->
                      <v-list-item-title>
                        <v-text-field v-model="polls[key]" filled dense hide-details single-line></v-text-field>
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon @click="polls.splice(key, 1)">
                      <v-icon color="red">mdi-close</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </draggable>
              </v-list>

              <v-card-text>
                <v-text-field
                  v-model="pollText"
                  filled
                  label="New poll"
                  @keydown.enter.prevent="polls.push(pollText), pollText = ''"
                ></v-text-field>
                <v-btn
                  color="primary"
                  outlined
                  @click="polls.push(pollText), pollText = ''"
                  :disabled="!pollText"
                >Add poll</v-btn>
              </v-card-text>
            </template>

            <v-card-text>
              <v-autocomplete
                :items="slackChannels"
                v-model="selectedChannels"
                item-text="name"
                return-object
                label="Send it to slack channels"
                multiple
              ></v-autocomplete>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                outlined
                type="submit"
                form="form-create"
                :disabled="!valid"
              >Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "@/store";
import router from "@/router";
import draggable from "vuedraggable";

import CardService from "@/services/card";
import SlackService from "@/services/slack";

import Card from "@/components/Card";
import CardImages from "@/components/CardImages";

export default {
  name: "create",
  components: {
    CardImages,
    draggable
  },
  data() {
    return {
      valid: false,
      images: [],
      title: "",
      type: "order",
      delivery: 0,
      slackChannels: [
        {
          name: "#lunch",
          id: "CHS9P8G3Z"
        },
        {
          name: "#spdev-if",
          id: "CJMTWTVMF"
        },
        {
          name: "#general",
          id: "C96TXGT0F"
        },
        {
          name: "#gramtest",
          id: "CSF640XKN"
        }
      ],
      selectedChannels: [
        // {
        // 	name: '#lunch',
        // 	id: 'CHS9P8G3Z'
        // }
      ],
      polls: [],
      anonime: true,
      pollText: ""
    };
  },
  methods: {
    async createCard(page = 1) {
      try {
        if (this.$refs.formCreate.validate()) {
          let card = {
            images: this.images,
            title: this.title,
            type: this.type,
            slackChannels: this.selectedChannels
          };
          if (this.type == "order") {
            card.delivery = this.delivery;
          }
          if (this.type == "poll") {
            card.anonime = this.anonime;
            card.polls = this.polls;
          }

          const res = await CardService.createCard(card);

          localStorage.setItem("gramCreatedImages", JSON.stringify([]));
          router.push("/card/" + res.data.data._id);
        }
      } catch (err) {
        store.dispatch("setError", err);
      }
    },
    onChangeImages(images) {
      localStorage.setItem("gramCreatedImages", JSON.stringify(images));
      this.images = images;
    }
  },
  created() {
    try {
      const localImages = JSON.parse(localStorage.getItem("gramCreatedImages"));
      if (localImages && localImages.length) {
        this.images = localImages;
      }
    } catch (e) {}
  }
};
</script>
