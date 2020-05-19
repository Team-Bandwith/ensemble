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
      <b-button @click="addFriend">Add Friend</b-button>
    </template>
    <b-card-body>
      <b-card-text>
        Some quick example text to build on the card title and make up the bulk of the card's
        content.
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>Likous(99) contributous(21)</b-list-group-item>
      <b-list-group-item>contact: <b>{{user.email}}</b></b-list-group-item>
    </b-list-group>
    <div class='loader' v-if="myId === parseInt($route.params.id)">
    <b-card-body>
      Upload your Photo Here:
      <PhotoUpload v-on:new-avatar='newAvatar' :user='user'/>
    </b-card-body>
    </div>

    <b-card-footer>Friends</b-card-footer>

    <b-card-img src="https://placekitten.com/480/210" alt="Image"></b-card-img>
  </b-card>
</div>
  </div>
    </b-col>
  </b-row>
</template>

<script>
import { request } from 'graphql-request';
import PhotoUpload from '@/components/PhotoUpload.vue';

export default {
  name: 'ProfileCard',
  components: {
    PhotoUpload,
  },
  props: {
    user: Object,
    myId: Number,
  },
  methods: {
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
    addFriend() {
      const mutation = `
      mutation {
        addFriend(id_user_to: ${this.$route.params.id}, id_user_from: ${this.myId}) {
          id
        }
      }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>

</style>
