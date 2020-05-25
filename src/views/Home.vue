<template>
  <b-row>
    <b-col>
  <div class="home">
    <SongsList msg="Welcome to Ensemble"
      :loggedIn="loggedIn"
      :liked="liked"
      :user="user"
      :friends="friends"
      v-on:new-like="newLike"
    />
  </div>
    </b-col>
  </b-row>
</template>

<script>
// @ is an alias to /src
import SongsList from '@/components/SongsList.vue';

export default {
  name: 'Home',
  components: {
    SongsList,
  },
  props: {
    loggedIn: Boolean,
    liked: Array,
    user: Object,
    friends: Object,
  },
  methods: {
    newLike() {
      this.$emit('new-like');
    },
  },
};
</script>
