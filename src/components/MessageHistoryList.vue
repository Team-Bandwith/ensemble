<template>
  <b-container class="message-container">
    <section flush>
      <div class="indv-message"
          :class="[ Number(this.myId) === Number(this.message.id_user_from)
          ? 'green' : 'white' ]"
          >
        <div class="mr-auto">
          <b-avatar
          :href="'/profile/' + message.id_user_from"
          :src="message.url_avatar"
          :size="24"
          class="mr-3"
          :class="[ Number(this.myId) === Number(this.message.id_user_from)
          ? 'float-right' : 'float-left' ]"
          ></b-avatar>
              {{ message.text }}
            </div>
      </div>
    </section>
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
.indv-message {
  border: 2px solid #6d8657;
  background-color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.green {
  border-color: #6d8657;
  background-color: #6d8657;
}

/* Clear floats */
.indv-message::after {
  content: "";
  clear: both;
  display: table;
}
</style>
