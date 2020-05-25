<template>
  <b-container fluid style="background-color:#98AC9E;">
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
  computed: {
    myId() {
      return this.user ? this.user.id : null;
    },
  },
  methods: {
    getAllSongs() {
      const query = `query {
      getAllSongs {
        id, 
        id_author, 
        name, 
        url, 
        count_likes,
        created_at,
        username,
        url_avatar
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
    console.log('songs list created');
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

</style>
