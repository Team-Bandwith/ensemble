<template>
  <b-container>
    <b-row align-h="end">
      <b-button variant="primary" @click="toggleInv">Invite</b-button>
    </b-row>
    <b-row align-h="end">
      <SendInvite v-model="invOpen" :online="online" />
    </b-row>
    <b-row>
      <b-col v-for="user in users" v-bind:key="user.id">
        <span>{{ user.username }}</span>
        <img v-if="user.url_avatar" :src="user.url_avatar" />
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
  },
  methods: {
    toggleInv() {
      this.invOpen = !this.invOpen;
    },
  },
};
</script>

<style>

</style>
