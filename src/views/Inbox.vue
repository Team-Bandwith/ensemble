<template>
  <b-row>
    <b-col>

  <div class="inbox">
    <h1>This is the inbox page</h1>
  </div>
  <div class="jam-invite">
    <JamInvite/>
  </div>
    <div class="friend-request">
    <FriendRequest/>
  </div>
  <div class="direct-message">
    <DirectMessage/>
  </div>
    </b-col>
  </b-row>
</template>

<script>
import JamInvite from '../components/JamInvite.vue';
import FriendRequest from '../components/FriendRequest.vue';
import DirectMessage from '../components/DirectMessage.vue';

export default {
  name: 'inbox',
  components: {
    JamInvite,
    FriendRequest,
    DirectMessage,
  },
};
</script>

<style>

</style>
