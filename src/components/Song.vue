<template>
  <b-container fluid>
    <div class="song-item">
        <b-row cols="12">
          <b-col>
            <div class="song-title">{{ song.name }}</div>
          </b-col>
        <div class="song-created-at">
          <em>{{ handleMoment(song.created_at).fromNow() }}</em>
        </div>
        </b-row>
        <b-row cols="12">
          <b-col cols="3">
            <img v-if="song.url_avatar" :src="song.url_avatar" />
          </b-col>
          <b-col cols="2">
            <div class="created-by">
              created by: <router-link
                :to="`/profile/${song.id_author}`">{{ song.username }}</router-link>
            </div>
          </b-col>
        </b-row>
        <b-row cols="12">
         <b-col>
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
         </b-col>
         <b-col>
            <div class="song-likes">
              <b-button
                v-if="user && !liked.map((like) => like.id).includes(song.id)"
                @click="likeSong(song.count_likes, song.id)">Like</b-button>
              <b-button v-else-if="user" @click="unlikeSong(song.id)">Unlike</b-button>
                {{ this.likes }}
            </div>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col>
        <div class="song-comments">
          <div>
            <!-- button to toggle element -->
            <b-button v-b-toggle="'collapse' + song.id">Comments</b-button>
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            <b-collapse :id="'collapse' + song.id">
              <CommentsList :song="song" :user="user" :myId="myId"></CommentsList>
            </b-collapse>
          </div>
        </div>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>

import { request } from 'graphql-request';
import CommentsList from './Comments/CommentsList.vue';

const moment = require('moment');

export default {
  name: 'Song',
  props: {
    msg: String,
    loggedIn: Boolean,
    song: Object,
    liked: Array,
    user: Object,
    myId: Number,
  },
  components: {
    CommentsList,
  },
  data() {
    return {
      handleMoment: moment,
      likes: null,
      isPlaying: false,
      player: null,
    };
  },
  mounted() {
    this.likes = this.song.count_likes;
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
          this.player.onended = () => {
            this.isPlaying = false;
          };
        }
        this.player.play();
        this.isPlaying = true;
      }
    },
    likeSong(likes, songId) {
      // console.log('like', likes);
      const query = `mutation {
      likeSong(id: ${songId}, id_user: ${this.myId}) {
        count_likes
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.likes = res.likeSong.count_likes;
          this.$emit('new-like');
        })
        .catch((err) => console.log(err));
    },
    unlikeSong(songId) {
      const query = `mutation {
      unlikeSong(id: ${songId}, id_user: ${this.myId}) {
        count_likes
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.likes = res.unlikeSong.count_likes;
          this.$emit('new-like');
        })
        .catch((err) => console.log(err));
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
