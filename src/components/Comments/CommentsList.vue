<template>
<b-container>
  <div class="comments-list overflow-auto">
    <div v-for="comment in comments" :key="comment.id">
      <Comment :comment="comment" :user="user"></Comment>
    </div>
  </div>

  <CommentInput
    v-if="myId"
    v-on:new-comment="addNewComment"
    :song="song"
    :user="user"
    :myId="myId"
    :username="username"
  >
  </CommentInput>

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
    myId: Number,
    username: String,
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
    scrollDown() {
      const container = this.$el.querySelector('.comments-list');
      container.scrollTop = container.scrollHeight;
    },
    addNewComment(comment) {
      this.comments = [...this.comments, comment];
    },
    getSongComments() {
      const query = `query {
      getSongComments(id_song: ${this.song.id}) {
        id, 
        id_user, 
        id_song, 
        text,
        created_at
        username
        url_avatar
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.comments = res.getSongComments;
        })
        .catch((err) => console.log(err));
    },
  },
  updated() {
    this.scrollDown();
  },
};
</script>
<style scoped>
.comments-list {
  height: 120px;
  margin-bottom: 10px;
  padding-bottom: 20px;
  width: 100%;
}
</style>
