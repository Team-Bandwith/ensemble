<template>
  <b-container fluid>
    <div v-for="song in songs" :key="song.id">
<<<<<<< HEAD
       <Song
        :song="song"
        :liked="liked"
        :user="user"
        :myId="myId"
        v-on:new-like="newLike"
      />
=======
       <div class="song">
        <Song
          :song="song"
          :liked="liked"
          :user="user"
          :myId="user.id"
          v-on:new-like="newLike"
        />
      </div>
>>>>>>> (chore) seperate songs with margin in songsList
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
    feed: String,
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
      if (this.myId) {
        let idString = this.myId.toString();
        Object.keys(this.friends).forEach((id) => {
          idString += `,${id}`;
        });
        return `{${idString}}`;
      }
      return '';
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
          if (this.myId) {
            this.songs = res.getAllSongs.filter((song) => Number(song.id_author) !== this.myId);
          } else {
            this.songs = res.getAllSongs;
          }
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
    if (this.user) {
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
    feed(val) {
      if (val === 'public') {
        this.getAllSongs();
      } else if (val === 'private') {
        this.getPrivateFeed();
      }
    },
  },
};
</script>

<style scoped>
.song {
  margin-bottom: 1em;
  background-color:#98AC9E;
}
</style>
