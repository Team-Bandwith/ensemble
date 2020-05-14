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
export default {
  data() {
    return {
      username: '',
      message: '',
      messages: [],
    };
  },
  methods: {
    sendMessage() {
      console.log(this.message);
      this.$socket.emit('message', this.message);
      this.message = '';
    },
  },
};
</script>

<style>

</style>
