<template>
  <div>
    <b-button v-b-modal.direct-message>Send Message</b-button>
    <b-modal
      id="direct-message"
      title="Message with Username"
      @ok="handleOk"
      hide-footer>
      <b-card>
        <b-card-text>
          <span v-for="message in messages" :key="message.id">
            <DirectMessage :message="message"/>
          </span>
        </b-card-text>
      </b-card>
      <b-form-input v-model="text" placeholder="send a message"></b-form-input>
      <b-button class="mt-3" block>Send</b-button>
    </b-modal>
  </div>
</template>

<script>
import { request } from 'graphql-request';

import DirectMessage from './DirectMessage.vue';

export default {
  name: 'MessageHistory',
  props: {
    id: Number,
  },
  components: {
    DirectMessage,
  },
  data() {
    return {
      messages: [],
      text: '',
      username: '',
    };
  },
  methods: {
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleClick();
    },
    handleClick() {
      const sendMessage = `mutation {
        sendMessage(id_user_to:, id_user_from: ${this.id}, text: ${this.text}, type: direct-message, created_at: ) {
          id_user_to,
          id_user_from,
          text,
          type,
          created_at
        }
      }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, sendMessage)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
