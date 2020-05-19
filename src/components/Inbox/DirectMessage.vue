<template>
  <b-container >
    <b-list-group flush>
      <div class="direct-message">
        <b-list-group-item variant="dark">
          <b-avatar :src="dm.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto">
              {{ dm.username }} sent you a
              <MessageHistory>message</MessageHistory>
            </span>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>
import MessageHistory from './MessageHistory.vue';

// import { request } from 'graphql-request';

export default {
  name: 'DirectMessage',
  props: {
    loggedIn: Boolean,
    dm: Object,
    id: Number,
  },
  components: {
    MessageHistory,
  },
};
</script>
