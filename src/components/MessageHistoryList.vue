<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-message">
          <b-avatar
          :src="message.url_avatar"
          class="mr-3"
          :class="[ Number(this.myId) === Number(this.message.id_user_from)
          ? 'float-right' : 'float-left' ]"
          ></b-avatar>
            <span class="mr-auto">
              {{ message.text }}
            </span>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>

// import { request } from 'graphql-request';

export default {
  name: 'MessageHistoryList',
  props: {
    loggedIn: Boolean,
    message: Object,
    myId: Number,
    userTo: String,
  },
  components: {

  },
  data() {
    console.log('myId:', this.myId);
    console.log('user_from:', this.message.id_user_from);
    return {
    };
  },
};
</script>

<style scoped>

</style>
