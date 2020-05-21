<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-message">
        <div>
            <span class="mr-auto">
              {{ message.text }}
            </span>
        </div>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>

// import { request } from 'graphql-request';

export default {
  name: 'MessageHistoryList',
  props: {
    loggedIn: Boolean,
    message: Object,
  },
  components: {

  },
};
</script>
