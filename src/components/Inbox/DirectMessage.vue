<template>
  <b-container >
    <b-list-group flush>
      <div class="direct-message">
        <b-list-group-item variant="dark">
          <b-avatar :src="invite.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto">
              <MessageHistory/>
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
  name: 'IndvInvite',
  props: {
    loggedIn: Boolean,
    message: Object,
  },
  components: {
    MessageHistory,
  },
};
</script>
