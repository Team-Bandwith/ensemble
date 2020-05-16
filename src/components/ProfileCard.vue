<template>
  <b-row>
    <b-col>
  <div class="profile">
    <div class="profile-card">
  <b-card
    no-body
    style="max-width: 20rem; border:none; top:50px; right:50px; position:fixed;"
  >
    <template v-slot:header>
      <img v-if="user.url_avatar" :src="user.url_avatar" />
      <h4 class="mb-0">{{user.username}}</h4>
    </template>
    <b-card-body>
      <b-card-text>
        Some quick example text to build on the card title and make up the bulk of the card's
        content.
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>Cras justo odio</b-list-group-item>
      <b-list-group-item>Dapibus ac facilisis in</b-list-group-item>
      <b-list-group-item>Vestibulum at eros</b-list-group-item>
    </b-list-group>

    <b-card-body>
      Upload your Photo Here:
      <PhotoUpload v-on:new-avatar='newAvatar' :user='user'/>
    </b-card-body>

    <b-card-footer>Friends</b-card-footer>

    <b-card-img src="https://placekitten.com/480/210" alt="Image"></b-card-img>
  </b-card>
</div>
  </div>
    </b-col>
  </b-row>
</template>

<script>
import PhotoUpload from '@/components/PhotoUpload.vue';


export default {
  name: 'ProfileCard',
  components: {
    PhotoUpload,
  },
  props: {
    user: Object,
  },
  methods: {
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
  },
};
</script>

<style scoped>

</style>
