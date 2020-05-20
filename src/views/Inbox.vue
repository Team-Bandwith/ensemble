<template>
  <b-row>
    <b-col>

  <div class="inbox">
    <h1>Notifications</h1>
  </div>
  <div class="jam-invite">
    <JamInvite :id="user.id"/>
  </div>
    <div class="friend-request">
    <FriendRequest :id="user.id" v-on:friend="newFriend" />
  </div>
  <div class="direct-message">
    <DirectMessage/>
  </div>
    </b-col>
  </b-row>
</template>

<script>
import JamInvite from '@/components/JamInvite.vue';
import FriendRequest from '../components/FriendRequest.vue';
import DirectMessage from '../components/DirectMessage.vue';

export default {
  name: 'inbox',
  components: {
    JamInvite,
    FriendRequest,
    DirectMessage,
  },
  props: {
    loggedIn: Boolean,
    user: Object,
  },
  methods: {
    newFriend() {
      this.$emit('friend');
    },
  },
};
</script>

<style>
  .inbox {
    color: white;
  }
  .jam-invite {
    color: white;
  }

  .friend-request {
    color: white;
  }

  .direct-message {
    color: white;
  }
</style>
