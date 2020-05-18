<template>
  <div>
    <h3>Direct Message</h3>
    <div class="message-history">
    <MessageHistory/>
    </div>
  </div>
</template>

<script>
import MessageHistory from './MessageHistory.vue';

export default {
  name: 'direct-message',
  components: {
    MessageHistory,
  },
};
</script>

<style>

</style>
