<template>
  <div>
    <b-modal
      id="message-history"
      :title="`Message with ${user.username}`"
      @click="handleOk"
      @hidden="closeMessage"
      hide-footer>
      <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group>
      <b-form-input v-model="text" placeholder="send a message"></b-form-input>
      </b-form-group>
      <b-button class="mt-3" block @click="handleOk">Send</b-button>
      </form>
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
    user: Object,
    myId: Number,
    friends: Object,
    userTo: String,
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
      const sendMessage = `mutation {
        sendMessage(id_user_to: ${this.userTo}, id_user_from: ${this.myId}, text: "${this.text}") {
          id
        }
      }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, sendMessage)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      this.text = '';
    },
    closeMessage() {
      this.$bvModal.hide('message-history');
    },
  },
};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
