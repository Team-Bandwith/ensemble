/* eslint-disable max-len */
<template>
  <b-container fluid style="background-color:#98AC9E; width: 50%; margin-right: 50%; margin: 1px">
    <div v-for="song in songs" :key="song.id">
       <Song
        :song="song"
        :liked="liked"
        :user="user"
        v-on:new-like="newLike"
      />
      <hr>
    </div>
  </b-container>
</template>
<script>
import { request } from 'graphql-request';
import Song from './Song.vue';

export default {
  name: 'SongsList',
  props: {
    loggedIn: Boolean,
    liked: Array,
    user: Object,
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
    getAllSongs() {
      if (!this.loggedIn) {
        this.songs = [];
        return;
      }
      const query = `query {
      getAllSongs {
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
          this.songs = res.getAllSongs;
        })
        .catch((err) => console.log(err));
    },
    newLike() {
      this.$emit('new-like');
    },
  },
  created() {
    this.getAllSongs();
  },
  watch: {
    loggedIn() {
      this.getAllSongs();
    },
  },
};
</script>

<style scoped>
b-container {
  height: 50px;
}
</style>
