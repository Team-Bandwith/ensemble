<template>
  <b-container fluid>
    <div class="indv-invite">
        <b-row cols="12">
          <b-col>
            <div class="invite-avatar">
              <img :src="invite.url_avatar">
            </div>
            <div class="invite-id">{{ invite.username }}
            invited you to join their <a :href="'jam' + invite.link">jam room</a></div>
          </b-col>
        </b-row>
      </div>
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
