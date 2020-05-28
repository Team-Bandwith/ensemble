<template>
  <b-container>
    <div inline>
      <b-row>
      <div class="jammers col-sm-8"><h4>Jammers</h4></div>
      <button
        v-b-modal.invite-modal
        id="invite-button"
        @click="toggleInv">Invite
        </button>
      </b-row>
    </div>
    <b-row align-h="around">
      <b-col cols="2" v-for="user in users" v-bind:key="user.id">
        <b-avatar class="band-member-avatar" v-if="user.url_avatar" :src="user.url_avatar" />
        <p class="band-member-username">{{ user.username }} </p>
      </b-col>
    </b-row>
    <b-row>
      <SendInvite v-model="invOpen" :online="online" :you="you" />
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
#invite-button {
    height: 75%;
    background-color: #6d8657;
    border-color: #6d8657;
    color: white;
    border-style: none;
    border-radius: 0px;
    margin-top: 15px;
    padding-top: 6px;
    padding-right: 12px;
    padding-bottom: 6px;
    padding-left: 12px;
    margin-left: 155px;
}
#invite-collapse {
  float: right;
}
</style>
