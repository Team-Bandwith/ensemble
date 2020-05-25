<template>
  <b-row>
    <b-col>

  <div class="inbox">
    <h2>Notifications</h2>
  </div>
  <div class="jam-invite">
    <JamInvite :id="user.id"/>
  </div>
  <div class="friend-request">
    <FriendRequest :id="user.id" v-on:friend="newFriend" :user="user" />
  </div>
  <div class="direct-message-list">
    <DirectMessageList
      :user="user"
      :id="user.id"
    />
  </div>
    </b-col>
  </b-row>
</template>

<script>
import JamInvite from '@/components/JamInvite.vue';
import FriendRequest from '@/components/FriendRequest.vue';
import DirectMessageList from '@/components/DirectMessageList.vue';


export default {
  name: 'inbox',
  components: {
    JamInvite,
    FriendRequest,
    DirectMessageList,
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
  mounted() {
    this.$emit('checked');
  },
};
</script>

<style>
  h2 {
    margin-left: 50px;
  }
  .inbox {
    color: white;
  }
  .jam-invite {
    color: #99aca0;
  }

  .friend-request {
    color: #99aca0;
  }

  .direct-message-list {
    color: #99aca0;
  }
</style>
