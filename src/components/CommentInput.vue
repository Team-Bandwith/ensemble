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
        <b-button @click="handleComment">submit</b-button>
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
  },
  data() {
    return {
      commentText: '',
      commentState: null,
      handleMoment: moment,
    };
  },
  methods: {
    handleComment() {
      if (this.commentText) {
        console.log('comment made', this.commentText);
        this.addComment(1, 2, this.commentText);
        this.commentText = '';
        this.commentState = null;
      } else {
        alert('Please enter a comment');
        console.log('empty message');
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
          console.log('hey', res);
          // this.comments = res.data;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
