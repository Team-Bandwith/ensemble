<template>
  <b-container fluid>
    <div class="chat">
      <p>User is {{user.username}}</p>
      <b-row>
       <div class="messages">
         <ul>
          <div v-for="message in messages"
          v-bind:key=message.message>
          <span >{{message.user}}<small>: {{message.message}}</small>
          </span>
          </div>
        </ul>
       </div>
      </b-row>
      <b-row align-v="end">
        <b-form>
          <div>
            <b-form @submit.prevent="sendMessage" inline>
              <label class="sr-only" for="inline-form-input-name">Name</label>
                <b-input type="text" placeholder="Message..." v-model="message"/>
                <b-button type='submit' variant="primary">Send</b-button>
            </b-form>
          </div>
        </b-form>
      </b-row>
      </div>
    </b-container>
</template>

<script>
// import Message from './message.vue';

export default {
  name: 'Chat',
  components: {
    // Message,
  },

  props: {
    user: Object,
  },

  data() {
    return {
      message: '',
      messages: [],
      typing: false,
      ready: false,
    };
  },
  methods: {
    sendMessage() {
      const message = {
        message: this.message,
        user: this.user.username,
      };
      // console.log(message);
      this.$socket.emit('sendMessage', { message, room: window.location.search });
      this.message = '';
    },
  },
  sockets: {
    receiveMessage(message) {
      this.messages = [...this.messages, message];
    },
  },
};
</script>

<style>

</style>
