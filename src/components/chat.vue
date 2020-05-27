<template>
  <b-container fluid>
    <b-row>
    <div class="chat">
      <div id="chat-messages">
        <span v-for="message in messages" v-bind:key=message.message>
          <div id="user-message">
          <span id="chat-user">{{message.user}}:</span>
          <span id="chat-message"> {{message.message}}</span>
          </div>
        </span>
      </div>
        <b-form>
          <div>
            <b-form @submit.prevent="sendMessage" inline>
              <label class="sr-only" for="inline-form-input-name">Name</label>
                <b-input
                  type="text"
                  id="chat-input"
                  placeholder="Message..."
                  v-model="message"
                  @focus="chat"
                  @blur="doneChat"
                />
                <button id="chat-button" squared class="btn" type='submit'>Send</button>
            </b-form>
          </div>
        </b-form>
    </div>
    </b-row>
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
      this.$socket.emit('sendMessage', { message, room: this.$route.query.room });
      this.message = '';
    },
    chat() {
      this.$emit('deact');
    },
    doneChat() {
      this.$emit('active');
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
#chat-messages {
  background-color: #3B3836;
  height: 400px;
  width: 250px;
}
#user-message {
  margin-top: 10px;
  margin-right: 5px;
  margin-left: 5px;
}
#chat-user {
  color: #6b8554;
}
#chat-message {
  color: white;
}
#chat-input {
  background-color: #3B3836;
  border-color: #3B3836;
  border-radius: 0px;
  width: 180px;
  color: white;
  margin-top: 5px;
  margin-right: 5px;
}
#chat-button {
  background-color: #6d8657;
  color: white;
  border-radius: 0px;
  margin-top: 5px;
}
</style>
