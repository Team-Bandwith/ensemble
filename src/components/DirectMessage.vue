<template>
  <b-container >
    <b-list-group flush>
      <div class="direct-message">
        <b-list-group-item variant="dark">
          <b-avatar :src="invite.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto">
              {{ message.username }}
            </span>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>

// import { request } from 'graphql-request';

export default {
  name: 'IndvInvite',
  props: {
    loggedIn: Boolean,
    message: Object,
  },
  components: {

  },
};
</script>
