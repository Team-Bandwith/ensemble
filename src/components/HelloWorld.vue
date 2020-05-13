<template>
  <b-container fluid>

    <div v-for="song in songs" :key="song.id">
        <div class="song-item">
        <b-row cols="12">
          <b-col>
            <div class="song-id">id:{{ song.id }}</div>
            <div class="song-title">title:{{ song.name }}</div>
            <div class="song-url">
              url:{{ song.url }}
            </div>
            <div class="song-likes">#likes:{{ song.count_likes }}</div>
            <div class="song-likes">
              created at:
              {{ handleMoment(song.created_at).fromNow() }}
            </div>
          </b-col>
        </b-row>
      </div>
      <hr>
    </div>

  </b-container>
</template>

<script>
import { request } from 'graphql-request';

const moment = require('moment');

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    loggedIn: Boolean,
  },
  data() {
    return {
      handleMoment: moment,
      songs: [],
    };
  },
  methods: {
    getAllSongs() {
      if (!this.loggedIn) {
        this.songs = [
          {
            id: 1,
            name: 'test1',
            url: 'http://#1',
            created_at: new Date(),
          },
          {
            id: 1,
            name: 'test2',
            url: 'http://#2',
            created_at: new Date(),
          },
        ];
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.song-item{
  padding: 1em;
}
.song-title{
  font-weight: bold;
}
</style>
