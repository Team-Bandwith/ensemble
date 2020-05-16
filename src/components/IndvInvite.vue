<template>
  <b-container fluid>
    <div class="indv-invite">
        <b-row cols="12">
        <b-list-group style="width: 1000px;">
        <b-list-group-item class="d-flex align-items-center">
        <b-avatar variant="info" :src="invite.url_avatar" class="mr-3"></b-avatar>
        <span class="mr-auto">{{ invite.username }}
            invited you to join their <a :href="'jam' + invite.link">jam room</a></span>
        </b-list-group-item>
        </b-list-group>
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
