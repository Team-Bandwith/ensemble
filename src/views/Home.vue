<template>
  <b-row>
    <b-col>
  <div class="home">
    <SongsList msg="Welcome to Ensemble" :loggedIn="loggedIn" />
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
  },
};
</script>
