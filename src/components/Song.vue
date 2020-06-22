<template>
  <b-container fluid>
    <div class="green"><!-- begin green -->
    <div class="song-item">
        <b-row cols="12">
            <div class="song-title">{{ song.name }}</div>
            <div class="song-created-at">
              <em class="moment-prefix">{{ handleMoment(song.created_at).fromNow() }}</em>
            </div>
            <div class="created-by">by:
             <router-link
              :to="`/profile/${song.id_author}`">
              {{ song.username }}
            </router-link>
            </div>
        </b-row>
        <b-row cols="12">
          <!-- <b-col>
            <b-avatar v-if="song.url_avatar" :src="song.url_avatar"  class='fluid wid'/>
          </b-col> -->
          <!-- <div class="song-created-at">
              <em>{{ handleMoment(song.created_at).fromNow() }}</em>
          </div> -->
        </b-row>
        <b-row cols="12">
         <b-col>
            <div class="song-url">
              <div>
                <div v-if="isPlaying">
                   <font-awesome-icon
                    icon="pause"
                    class="play align-top"
                    size="2x"
                    @click="playSong()"
                  />
                </div>
                <div v-else>
                  <font-awesome-icon
                    icon="play"
                    class="play align-top"
                    size="2x"
                    @click="playSong(song.url)"
                  />
                </div>
              </div>
            </div>
         </b-col>
         <b-col>
            <div class="song-likes">
              <font-awesome-icon
                icon="thumbs-up"
                class="like align-top"
                size="2x"
                v-if="user && !liked.map((like) => like.id).includes(song.id)"
                @click="likeSong(song.count_likes, song.id)"
              />
              <font-awesome-icon
                icon="thumbs-up"
                class="unlike align-top"
                size="2x"
                v-else-if="user" @click="unlikeSong(song.id)"
              />
              <font-awesome-icon
                icon="thumbs-up"
                class="align-top"
                size="2x"
                v-else
              />
                {{ this.likes }}
            </div>
          </b-col>
           <b-col>
        <div class="song-comments">
          <div>
            <!-- button to toggle element -->
            <font-awesome-icon
                    icon="comments"
                    class="comments align-top"
                    size="2x"
                    v-b-toggle="'collapse' + song.id"
             />
            <!-- eslint-disable-next-line vue/no-parsing-error -->
          </div>
        </div>
        </b-col>
        </b-row>
        </div><!-- end gren -->
      </div>
      <div class="comment-bg">
      <b-row>
        <b-col>
            <b-collapse :id="'collapse' + song.id">
              <CommentsList :song="song" :user="user" :myId="myId"></CommentsList>
            </b-collapse>
        </b-col>
      </b-row>
      </div>
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
      likeEnabled: true,
    };
  },
  mounted() {
    this.likes = this.song.count_likes;
  },
  watch: {
    liked() {
      this.likeEnabled = true;
    },
  },
  methods: {
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
      if (!this.likeEnabled) {
        return;
      }
      const query = `mutation {
      likeSong(id: ${songId}, id_user: ${this.myId}) {
        count_likes
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.likes = res.likeSong.count_likes;
          this.$emit('new-like');
          this.likeEnabled = false;
        })
        .catch((err) => console.log(err));
    },
    unlikeSong(songId) {
      if (!this.likeEnabled) {
        return;
      }
      const query = `mutation {
      unlikeSong(id: ${songId}, id_user: ${this.myId}) {
        count_likes
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.likes = res.unlikeSong.count_likes;
          this.$emit('new-like');
          this.likeEnabled = false;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style>
.song-item {
  padding: 1em;
  color:#000;
}
.song-title{
  font-weight: bold;
  font-size: 1.7rem;
  float: left;
  width: 100%;
  margin-top: -10px;
}
.created-by a {
  color: #000;
}
.created-by a:hover {
  color: #6b8554;
}
.song-created-at {
  color: #3B3836;
  float: right;
  margin-bottom: 20px;
}
.like:hover {
  cursor: pointer;
}
.unlike {
  color: #6d8657;
}
.unlike:hover {
  cursor: pointer;
}
.comments:hover {
  cursor: pointer;
}
.comment-bg {
  width: 100%;
  background: #3B3836;
}
.green {
  background: #98AC9E;
  padding: 1em;
}
.moment-prefix {
  padding-right: 4px;
}
</style>
