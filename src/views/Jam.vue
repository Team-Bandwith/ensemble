<template>
  <b-container class="jam-page">
    <b-row v-align="start">
      <b-col cols="8" >
        <div class="jam-instrument">
          <Instrument :id="user.id" />
        </div>
      </b-col>
      <b-col cols="4" class="jam-chat">
         <Chat :user="user"/>
      </b-col>
    </b-row>
    <b-row align-v="end" >
      <b-col class="jam-band">
        <BandMembers :users="users" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable camelcase */
import Tone from 'tone';
import randomstring from 'randomstring';
import Instrument from '../components/instrument.vue';
import Chat from '../components/chat.vue';
import BandMembers from '../components/band-members.vue';


export default {
  name: 'jam',
  components: {
    Instrument,
    Chat,
    BandMembers,
  },
  data() {
    return {
      users: [],
    };
  },
  props: {
    user: Object,
  },
  watch: {
    user(val) {
      this.$socket.emit('join', { room: window.location.search, user: val });
      Tone.start();
    },
  },
  mounted() {
    if (!window.location.search) {
      window.location.search = randomstring.generate();
    }
  },
  sockets: {
    updateUsers(currUsers) {
      this.users = currUsers.filter((user) => user.id !== this.user.id);
    },
  },
};

</script>

<style>
.jam-instrument {
  height: 60vh;
}
</style>
