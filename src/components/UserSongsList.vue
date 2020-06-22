/* eslint-disable max-len */
<template>
  <b-container fluid>
      <h3 v-if="songs.length > 0" class='list-title'>Original Songs</h3>
    <div v-for="song in songs" :key="song.id">
      <div class='listcontainer'>
       <Song
        :song="song"
        :liked="liked"
        :user="user"
        :myId="myId"
        :username="username"
        v-on:new-like="newLike"
        v-on:unlike="unlike"
      />
      </div>
      <hr>
    </div>
  </b-container>
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
    username: String,
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
    newLike(songId) {
      this.$emit('new-like', songId);
    },
    unlike(songId) {
      this.$emit('unlike', songId);
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
  margin-bottom: 1em;
  background-color:#98AC9E;
}
.list-title {
  font-size: 1.5rem;
  color: #99aca0;
  margin-left: -16px;
}
</style>
