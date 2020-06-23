<template>
  <b-container>
    <b-row>
      <form ref="form" @submit.stop.prevent="handleSubmit">

          <b-form-input
            squared
            class="input-sub"
            :id="song.id"
            v-model="commentText"
            :state="commentState"
            @keypress.enter="handleComment(myId, song.id)"
          ></b-form-input>

      </form>
        <b-button
          squared
          class="comment-submit"
          @click="handleComment(myId, song.id)"
        >
          submit
        </b-button>
    </b-row>
  </b-container>
</template>
<script>
import moment from 'moment';
import { request } from 'graphql-request';

export default {
  name: 'CommentInput',
  props: {
    loggedIn: Boolean,
    comment: Object,
    user: Object,
    song: Object,
    myId: Number,
    username: String,
  },
  data() {
    return {
      commentText: '',
      commentState: null,
      handleMoment: moment,
    };
  },
  mounted() {
    this.$socket.on(`receiveComment${this.song.id}`, (comment) => this.renderComment(comment));
  },
  methods: {
    handleSubmit(event) {
      event.preventDefault();
    },
    handleComment(userId, songId) {
      if (this.commentText) {
        this.addComment(userId, songId, this.commentText);
        this.commentText = '';
        this.commentState = null;
      } else {
        console.log('please enter a comment');
      }
    },
    renderComment(comment) {
      this.$emit('new-comment', comment);
    },
    addComment(userId, songId, text) {
      const newComment = {
        id_user: userId,
        id_song: songId,
        text,
        username: this.username,
        create_at: new Date(),
      };

      this.renderComment(newComment);
      this.$socket.emit('newComment', newComment);

      const query = `mutation {
      addComment(id_user: ${userId}, id_song: ${songId}, text: "${text}") {
        id,
        text,
      }
    }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style scoped>
.comment-submit {
  margin-left: 10px;
}
.input-sub {
  border-radius: 0;
  background: #3B3836;
  width: 100%;
  color: #fff;
}
form:focus {
  outline:0;
}
form {
  width: 82%;
}
input:hover,
input:focus,
input:active {
  background-color: #3B3836;
  text-shadow: none;
  border-color: #fff;
  outline: none;
  color: #fff;
}
textarea:focus,
input[type="text"]:focus,
input[type="color"]:focus,
.uneditable-input:focus {
  border-color: #6b8554;
  box-shadow: 0 1px 1px #6b8554 inset, 0 0 8px #6b8554;
  outline: 0 none;
}
</style>
