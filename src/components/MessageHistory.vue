<template>
  <div>
    <b-button v-b-modal.direct-message>Send Message</b-button>
    <b-modal id="direct-message" title="Message with Username" hide-footer>
      <b-card>
        <b-card-text></b-card-text>
      </b-card>
      <b-form-input v-model="text" placeholder="send a message"></b-form-input>
      <b-button class="mt-3" block >Send</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'MessageHistory',
  data() {
    return {
      text: '',
    };
  },
};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
