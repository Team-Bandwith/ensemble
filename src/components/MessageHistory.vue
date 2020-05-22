<template>
  <div>
    <b-modal
      :id="`message-history${userTo}`"
      scrollable
      :title="`Message with ${user.username}`"
      @click="handleOk"
      @hidden="closeMessage"
      @show="open"
      hide-footer>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group>
          <b-card>
            <div>
            <span v-for="message in messages" :key="message.id">
              <MessageHistoryList
              :myId="myId"
              :userTo="userTo"
              :message="message"></MessageHistoryList>
            </span>
            </div>
          </b-card>
        <b-form-input v-model="text" placeholder="send a message"></b-form-input>
      </b-form-group>
      <b-button class="mt-3" block @click="handleOk">Send</b-button>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { request } from 'graphql-request';

import MessageHistoryList from './MessageHistoryList.vue';

export default {
  data() {
    return {
      messages: [],
      text: '',
      username: '',
    };
  },
  name: 'message-history',
  props: {
    user: Object,
    myId: Number,
    friends: Object,
    userTo: String,
  },
  components: {
    MessageHistoryList,
  },
  methods: {
    open() {
      this.messageHistory();
      const room = this.myId < this.userTo ? `${this.myId}${this.userTo}` : `${this.userTo}${this.myId}`;
      this.$socket.emit('openDM', room);
    },
    messageHistory() {
      const query = `query {
        messageHistory(user_id: ${this.myId}, friend_id: ${this.userTo}) {
          id,
          id_user_to,
          id_user_from,
          text,
          type,
          created_at,
          username,
          url_avatar,
        }
      }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.messages = res.messageHistory;
        })
        .catch((err) => console.log(err));
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      const sendMessage = `mutation {
        sendMessage(id_user_to: ${this.userTo}, id_user_from: ${this.myId}, text: "${this.text}") {
          id
        }
      }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, sendMessage)
        .then(() => {
          this.messageHistory();
          this.$socket.emit('notify', this.userTo);
          const room = this.myId < this.userTo ? `${this.myId}${this.userTo}` : `${this.userTo}${this.myId}`;
          this.$socket.emit('sendDM', room);
        })
        .catch((err) => console.log(err));
      this.text = '';
    },
    closeMessage() {
      const room = this.myId < this.userTo ? `${this.myId}${this.userTo}` : `${this.userTo}${this.myId}`;
      this.$socket.emit('closeDM', room);
      this.$bvModal.hide(`message-history${this.userTo}`);
      this.text = '';
    },
  },
  sockets: {
    getDM() {
      this.messageHistory();
    },
  },
};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
