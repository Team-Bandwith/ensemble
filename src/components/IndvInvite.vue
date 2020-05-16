<template>
  <b-container fluid>
    <div class="indv-invite">
        <b-row cols="12">
          <b-col>
            <div class="invite-id">id:{{ invite.id }}</div>
            <div class="user-from">title:{{ invite.id_user_from }}</div>
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
