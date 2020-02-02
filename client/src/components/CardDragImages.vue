<template>
  <v-card-actions>
    <draggable v-model="images" draggable=".draggable" class="layout row wrap draggable--wrap">
      <v-flex xs6 sm4 md3 v-for="(img, key) in images" :key="key" class="draggable">
        <v-img :src="img" aspect-ratio="1"></v-img>
        <v-btn class="draggable__close" color="error" fab x-small @click="emitDeleteImage(key)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6 sm4 md3 class="draggable__add">
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-btn
            fab
            large
            color="success"
            class="my-10"
            :loading="loading"
            @click="$refs.filesInput.click()"
          >
            <v-icon color="white">mdi-plus</v-icon>
          </v-btn>
          <input
            ref="filesInput"
            type="file"
            style="display: none;"
            accept="image/*"
            @change="emitFilesChange"
            multiple
          />
        </v-row>
      </v-flex>
    </draggable>
  </v-card-actions>
</template>

<script>
import draggable from "vuedraggable";

export default {
  props: {
    images: Array,
    loading: Boolean
  },
  components: {
    draggable
  },
  data() {
    return {};
  },
  methods: {
    emitFilesChange(event) {
      this.$emit("filesChange", event.target.files);
    },
    emitDeleteImage(key) {
      this.$emit("deleteImage", key);
    }
  }
};
</script>