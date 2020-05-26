<template>
  <b-container>
    <b-row align-h="end">
      <b-button variant="primary" @click="toggleInv">Invite</b-button>
    </b-row>
    <b-row>
      <SendInvite v-model="invOpen" :online="online" :you="you" />
    </b-row>
    <b-row>
      <b-col cols="2" v-for="user in users" v-bind:key="user.id">
        <img class="band-member-avatar" v-if="user.url_avatar" :src="user.url_avatar" />
        <span class="band-member-username">{{ user.username }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SendInvite from './SendInvite.vue';

export default {
  name: 'BandMembers',
  components: {
    SendInvite,
  },
  data() {
    return {
      invOpen: false,
    };
  },
  props: {
    users: Array,
    online: Array,
    you: Object,
  },
  methods: {
    toggleInv() {
      this.invOpen = !this.invOpen;
    },
  },
};
</script>

<style>

.band-member-username {
  text-align: center;
}

</style>
