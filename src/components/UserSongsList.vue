/* eslint-disable max-len */
<template>
<div class='listcontainer'>
  <b-container fluid>
    <div v-for="song in songs" :key="song.id">
       <Song
        :song="song"
        :liked="liked"
        :user="user"
        :myId="myId"
        v-on:new-like="newLike"
      />
      <hr>
    </div>
  </b-container>
</div>
</template>
<script>
import { request } from 'graphql-request';
import Song from './Song.vue';

export default {
  name: 'UserSongsList',
  props: {
    loggedIn: Boolean,
    liked: Array,
    user: Object,
    myId: Number,
  },
  components: {
    Song,
  },
  data() {
    return {
      songs: [],
    };
  },
  methods: {
    getUserSongs(id) {
      if (!this.loggedIn) {
        this.songs = [];
        return;
      }
      const query = `query {
      getUserSongs(id: ${id}) {
        id, 
        id_author, 
        name, 
        url, 
        count_likes,
        created_at
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.songs = res.getUserSongs.map((song) => {
            const userInfo = {
              username: this.user.username,
              url_avatar: this.user.url_avatar,
            };
            return { ...song, ...userInfo };
          });
        })
        .catch((err) => console.log(err));
    },
    newLike() {
      this.$emit('new-like');
    },
  },
  created() {
    this.getUserSongs(this.$route.params.id);
  },
  watch: {
    user(val) {
      this.getUserSongs(val.id);
    },
  },
};
</script>

<style scoped>
.listcontainer {
  background-color:#98AC9E;
}
</style>
