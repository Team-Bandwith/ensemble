<template>
  <b-container fluid>
    <ul id="example-1">
      <li v-for="song in songs" :key="song.id">
        <b-row>
          <b-col>
            <div class="song-id">{{ song.id }}</div>
            <div class="song-title">{{ song.name }}</div>
            <div class="song-url">{{ song.url }}</div>
          </b-col>
        </b-row>
      </li>
    </ul>
  </b-container>
</template>

<script>
import { request } from 'graphql-request';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    loggedIn: Boolean,
  },
  data() {
    return {
      songs: [
        { id: 1, name: 'test1', url: 'http://#1' },
        { id: 2, name: 'test2', url: 'http://#2' },
      ],
    };
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
        created_at
      }
    }`;
      request('http://localhost:8081/api', query)
        .then((res) => console.log('sucess!', res))
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    const loggedIn = false;
    if (loggedIn) {
      this.songs = [{ id: 3, name: 'test2', url: 'http://#2' }];
    }
    this.songs = this.getAllSongs();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
