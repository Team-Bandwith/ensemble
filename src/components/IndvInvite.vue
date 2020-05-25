<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-invite">
        <b-list-group-item class="indv-invite">
          <b-avatar :src="invite.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto user-name">
              {{ invite.username }}
            </span>
            <span class="user-text">
              invited you to join their
              <a :href="'jam' + invite.link" id="invite-link">jam room</a>
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

<style scoped>
.indv-invite {
  background-color: #1f1e1d;
}
#invite-link {
  color: #99aca0;
}
.user-name {
  color: #99aca0;
  font-size: 25px;
}
.user-text {
  color: white;
  font-size: 25px;
}
</style>
