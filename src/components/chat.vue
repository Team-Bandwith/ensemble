<template>
  <b-container fluid>
    <div class="chat">
      <b-row>
       <div class="messages">
         <Message/>
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
import Message from './message.vue';

export default {
  name: 'Chat',
  components: {
    Message,
  },

  props: {
    user: Object,
  },

  data() {
    return {
      username: '',
      message: '',
      messages: [],
      typing: false,
      ready: false,
    };
  },
  methods: {
    sendMessage() {
      this.messages.push(this.message);
      console.log(this.messages);
      this.$socket.emit('message', this.message);
      this.message = '';
    },
  },
};
</script>

<style>

</style>
