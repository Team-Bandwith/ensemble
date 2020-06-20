<template>
  <b-container >
  <MessageHistory
    :userTo='dm.id_user_from'
    :myId='user.id'
    :user='dm'
    :myAvatar='user.url_avatar'
  />
    <b-list-group flush>
      <div class="direct-message">
        <b-list-group-item class="direct-message">
          <b-avatar :src="dm.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto user-name">
              {{ dm.username }}
              </span>
              <span class="user-text">
              says:
              <span @click="openHistory" class="message">
              {{ dm.text }}
              </span>
              <div class="time"> {{ moment(dm.created_at).fromNow() }} </div>
            </span>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>
import moment from 'moment';
import MessageHistory from './MessageHistory.vue';

export default {
  name: 'DirectMessage',
  data() {
    return {
      moment,
    };
  },
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

<style scoped>
.message {
  color: #6d8657;
}

.message:hover {
  cursor: pointer;
}
.direct-message {
  background-color: #1f1e1d;
}
.user-name {
  color: #99aca0;
  font-size: 25px;
}
.user-text {
  color: white;
  font-size: 25px;
}
.time {
  font-size: 10px;
  margin-top: -10px;
  margin-left: 65px;
}
</style>
