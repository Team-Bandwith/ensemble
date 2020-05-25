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
    friends: Object,
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
    userIDs() {
      let idString = this.myId.toString();
      Object.keys(this.friends).forEach((id) => {
        idString += `,${id}`;
      });
      return `{${idString}}`;
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
    getPrivateFeed() {
      const query = `query {
        getPrivateFeed(userIDs: "${this.userIDs}") {
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
          this.songs = res.getPrivateFeed;
        })
        .catch((err) => console.log(err));
    },
    newLike() {
      this.$emit('new-like');
    },
  },
  created() {
    if (this.friends) {
      this.getPrivateFeed();
    } else {
      this.getAllSongs();
    }
  },
  watch: {
    loggedIn(val) {
      if (!val) {
        this.getAllSongs();
      }
    },
    friends() {
      this.getPrivateFeed();
    },
  },
};
</script>

<style scoped>

</style>
