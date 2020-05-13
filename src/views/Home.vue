<template>
  <b-row>
    <b-col>
  <div class="home">
    <HelloWorld msg="Welcome to Ensemble" :loggedIn="loggedIn" />
  </div>
    </b-col>
  </b-row>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  props: {
    loggedIn: Boolean,
  },
};
</script>
