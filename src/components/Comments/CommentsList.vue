<template>
<b-container>
   <div v-for="comment in comments" :key="comment.id">
       <Comment :comment="comment"></Comment>
  </div>
  <CommentInput v-on:new-comment="getSongComments" :song="song" :user="user"></CommentInput>
</b-container>
</template>

<script>
import request from 'graphql-request';
import Comment from './Comment.vue';
import CommentInput from './CommentInput.vue';

export default {
  props: {
    id_user: Number,
    text: String,
    user: Object,
    song: Object,
  },
  components: {
    CommentInput,
    Comment,
  },
  data() {
    return {
      comments: [],
    };
  },
  created() {
    this.getSongComments();
  },
  methods: {
    getSongComments() {
      const query = `query {
      getSongComments(id_song: ${this.song.id}) {
        id, 
        id_user, 
        id_song, 
        text,
        created_at
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.comments = res.getSongComments;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style scoped>

</style>
