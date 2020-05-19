<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-invite">
        <b-list-group-item variant="dark">
          <b-avatar :src="invite.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto">
              {{ invite.username }} invited you to join their
              <a :href="'jam' + invite.link">jam room</a>
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
    invite: Object,
  },
  components: {

  },
};
</script>
