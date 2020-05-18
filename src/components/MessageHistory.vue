<template>
  <div>
    <h2>send a message</h2>
    <b-button v-b-modal.direct-message>Send Message</b-button>
    <b-modal id="direct-message" title="Message with Username">
      <div class="mt-2">Value: {{ text }}</div>
      <b-form-input v-model="text" placeholder="send a message"></b-form-input>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'MessageHistory',

};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
