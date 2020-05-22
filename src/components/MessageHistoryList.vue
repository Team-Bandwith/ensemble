<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-message">
        <b-list-group-item
            class="mr-auto"
            :variant="[ Number(this.myId) === Number(this.message.id_user_from)
            ? variant='info' : variant='dark' ]">
          <b-avatar
          :href="'/profile/' + message.id_user_from"
          :src="message.url_avatar"
          :size="24"
          class="mr-3"
          :class="[ Number(this.myId) === Number(this.message.id_user_from)
          ? 'float-right' : 'float-left' ]"
          ></b-avatar>
              {{ message.text }}
            </b-list-group-item>
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
};
</script>

<style scoped>

</style>
