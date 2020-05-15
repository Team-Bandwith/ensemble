<template>
  <b-container fluid>
    <div class="song-item">
        <b-row cols="12">
          <b-col>
            <div class="song-id">id:{{ song.id }}</div>
            <div class="song-title">title:{{ song.name }}</div>
            <div class="song-url">
              <div>
                <div v-if="isPlaying">
                  <b-button @click="playSong()">Pause</b-button>
                </div>
                <div v-else>
                  <b-button @click="playSong(song.url)">Play</b-button>
                </div>
              </div>
            </div>
            <div class="song-likes">
              <b-button @click="likeSong(song.count_likes, song.id)">Like</b-button>
                {{ this.likes || song.count_likes }}
            </div>
          <div class="song-created-at"> posted: {{ handleMoment(song.created_at).fromNow() }} </div>
            <div class="song-comments">
              <Comment></Comment>
            </div>
          </b-col>
        </b-row>
      </div>
  </b-container>
</template>

<script>

import { request } from 'graphql-request';
import Comment from './Comment.vue';

const moment = require('moment');

export default {
  name: 'Song',
  props: {
    msg: String,
    loggedIn: Boolean,
    song: Object,
  },
  components: {
    Comment,
  },
  data() {
    return {
      handleMoment: moment,
      likes: null,
      isPlaying: false,
      player: null,
    };
  },
  methods: {
    created() {
      this.$watch();
    },
    playSong(src) {
      if (this.isPlaying) {
        this.player.pause();
        this.isPlaying = false;
      } else {
        if (!this.player) {
          this.player = new Audio(src);
        }
        this.player.play();
        this.isPlaying = true;
      }
    },
    likeSong(likes, songId) {
      // console.log('like', likes);
      const query = `mutation {
      likeSong(id: ${songId}) {
        count_likes
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          console.log(res.likeSong);
          this.likes = res.likeSong.count_likes;
          // console.log('like this song', res);
        })
        .catch((err) => console.log(err));
    },
  },
  watch: {
    song(val) {
      this.likes = val.count_likes;
    },
  },
};
</script>

<style>
.song-item{
  padding: 1em;
}
.song-title{
  font-weight: bold;
}
</style>
