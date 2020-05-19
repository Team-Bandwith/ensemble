<template>
  <b-container>
    <b-row>
      <b-col>
      <form ref="form" @submit.stop.prevent="handleSubmit">

          <b-form-input
            id="comment-input"
            v-model="commentText"
            :state="commentState"
          ></b-form-input>

      </form>
      </b-col>
      <b-col>
        <b-button @click="handleComment(user.id, song.id)">submit</b-button>
      </b-col>
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
  },
  data() {
    return {
      commentText: '',
      commentState: null,
      handleMoment: moment,
      newUserComment: null,
    };
  },
  methods: {
    handleComment(userId, songId) {
      if (this.commentText) {
        this.addComment(userId, songId, this.commentText);
        this.commentText = '';
        this.commentState = null;
      } else {
        console.log('please enter a comment');
      }
    },
    addComment(user, songId, text) {
      // console.log('like', likes);
      const query = `mutation {
      addComment(id_user: ${user}, id_song: ${songId}, text: "${text}") {
        id,
        text,
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.newUserComment = res.addComment;
          this.$emit('new-comment');
          this.$emit('scroll-down');
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
