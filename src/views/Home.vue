<template>
  <b-row>
    <b-col>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Ensemble" />
    <SignUp />
  </div>
    </b-col>
  </b-row>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import SignUp from '@/components/SignUp.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    SignUp,
  },
  data() {
    return {
      modalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.modalOpen = !this.modalOpen;
    },
  },
};
</script>
