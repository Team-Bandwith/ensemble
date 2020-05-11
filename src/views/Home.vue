<template>
  <b-row>
    <b-col>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Ensemble" />
    <SignUp />
    <Login />
  </div>
    </b-col>
  </b-row>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import SignUp from '@/components/SignUp.vue';
import Login from '@/components/Login.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    SignUp,
    Login,
  },
};
</script>
