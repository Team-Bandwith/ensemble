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
        this.commentText = '';
        this.commentState = null;
      } else {
        alert('Please enter a comment');
        console.log('empty message');
      }
    },
  },
};
</script>
