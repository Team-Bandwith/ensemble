<template>
<b-container>
   <div v-for="comment in comments" :key="comment.id">
       <Comment :comment="comment"></Comment>
  </div>
  <CommentInput></CommentInput>
</b-container>
</template>
<script>
import Comment from './Comment.vue';
import CommentInput from './CommentInput.vue';

export default {
  props: {
    id_user: Number,
    text: String,
  },
  components: {
    CommentInput,
    Comment,
  },
  data() {
    return {
      comments: [{ id: 1, text: 'this is a comment' }, { id: 2, text: 'this is a comment2' }],
    };
  },
};
</script>
<style scoped>

</style>
