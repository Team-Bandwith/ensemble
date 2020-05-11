<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Ensemble" />
     <button class="btn" @click="openModal">Sign Up</button>
     <SignUp v-model="modalOpen"></SignUp>
  </div>
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
      username: '',
      password: '',
    };
  },
  methods: {
    openModal() {
      this.modalOpen = !this.modalOpen;
    },
  },
};
</script>
