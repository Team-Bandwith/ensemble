<template>
  <div>
    <b-button v-b-modal.direct-message>Send Message</b-button>
    <b-modal
      id="message-history"
      title="Message with Username"
      hide-footer>
      <b-card>
        <b-card-text>

        </b-card-text>
      </b-card>
      <b-form-input v-model="text" placeholder="send a message"></b-form-input>
      <b-button class="mt-3" block @click="handleOk">Send</b-button>
    </b-modal>
  </div>
</template>

<script>
import { request } from 'graphql-request';

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
    id: Number,
  },
  components: {

  },
  methods: {
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      console.log('click');
      const sendMessage = `mutation {
        sendMessage(id_user_to: 1, id_user_from: ${this.id}, text: "${this.text}") {
          id
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
