<template>
  <div>
    <CardDragImages
      v-if="edit"
      :images="images"
      :loading="loading"
      @filesChange="onFilesChange"
      @deleteImage="onDeleteImage"
    />

    <v-carousel
      v-if="images.length && !edit"
      cycle
      :hide-delimiters="true"
      show-arrows-on-hover
      :show-arrows="images.length > 1"
      height="400px"
      class="elevation-10"
    >
      <v-carousel-item v-for="(img, i) in images" :key="i" :src="img" position="center">
        <v-btn fab small class="ml-2 mt-2" color="primary" @click="openImage(img)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </v-carousel-item>
    </v-carousel>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false" color="black">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-img :src="dialogImage" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import store from "@/store";
import ImageService from "@/services/image";
import CardDragImages from "@/components/CardDragImages";

export default {
  props: {
    edit: Boolean,
    images: Array
  },
  components: {
    CardDragImages
  },
  data: () => ({
    dialog: false,
    dialogImage: "",
    loading: false
  }),
  methods: {
    onDeleteImage(key) {
      this.images.splice(key, 1);
      this.$emit("changeImages", this.images);
    },
    openImage(img) {
      this.dialog = true;
      this.dialogImage = img;
    },
    async onFilesChange(files) {
      try {
        this.loading = true;
        const formData = new FormData();
        files.forEach(file => {
          formData.append("filesImages", file);
        });

        const images = await ImageService.uploadImages(formData);

        if (images.data.data) {
          const newImages = images.data.data.map(image => {
            return image;
          });
          this.$emit("changeImages", this.images.concat(newImages));
        }
      } catch (e) {
        store.dispatch("setError", e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>