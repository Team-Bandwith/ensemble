<template>
  <b-container >
  <MessageHistory :userTo='dm.id_user_from' :myId='user.id' :user='dm'/>
    <b-list-group flush>
      <div class="direct-message">
        <b-list-group-item variant="dark">
          <b-avatar :src="dm.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto">
              {{ dm.username }}
              sent you a
              <span @click="openHistory">
              message
              </span>
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
  name: 'DirectMessage',
  props: {
    loggedIn: Boolean,
    dm: Object,
    id: Number,
    user: Object,
  },
  components: {
    MessageHistory,
  },
  methods: {
    openHistory() {
      console.log('click');
      this.$bvModal.show(`message-history${this.dm.id_user_from}`);
    },
  },
};
</script>
