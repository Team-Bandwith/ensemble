<template>
  <div>
    <h3>Direct Message</h3>
    <div class="message-history">
    <DirectMessage/>
    </div>
  </div>
</template>

<script>
import DirectMessage from './DirectMessage.vue';

export default {
  name: 'direct-message',
  components: {
    DirectMessage,
  },
};
</script>

<style>

</style>
