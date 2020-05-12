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
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      songs: [
        { id: 1, name: 'test1', url: 'http://#1' },
        { id: 2, name: 'test2', url: 'http://#2' },
      ],
      currentUser: '',
    };
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
