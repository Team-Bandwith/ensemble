<template>
  <b-container>
    <b-row align-h="end">
      <b-button
        squared
        variant="primary"
        class='button'
        @click="toggleInv">Invite
        </b-button>
    </b-row>
    <b-row>
      <SendInvite v-model="invOpen" :online="online" :you="you" />
    </b-row>
    <b-row align-h="around">
      <b-col cols="2" v-for="user in users" v-bind:key="user.id">
        <b-avatar class="band-member-avatar" v-if="user.url_avatar" :src="user.url_avatar" />
        <p class="band-member-username">{{ user.username }} </p>
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
</style>
