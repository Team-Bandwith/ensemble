<template>
  <div class="messages">
              <div>
            {{message.user}}|
            {{': '}}
            {{message.text}}
          </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
};

</script>

<style>

</style>
