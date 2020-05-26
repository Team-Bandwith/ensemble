<template>
  <b-container class="jam-page">
    <b-row>
      <b-col cols="8" >
    <b-row>
        <div class="jam-instrument">
          <Instrument
            :id="user.id"
            :active="active"
            :users="users"
            v-on:active="activate"
            v-on:deact="deactivate"
          />
        </div>
    </b-row>
    <b-row class="jam-band">
        <BandMembers
          :users="users"
          :you="user"
          :online="online.filter((usr) => usr.id !== user.id)"
        />
    </b-row>
      </b-col>
      <b-col cols="4" class="jam-chat">
        <Chat
          :user="user"
          v-on:active="activate"
          v-on:deact="deactivate"
        />
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
      active: true,
    };
  },
  props: {
    user: Object,
    online: Array,
  },
  watch: {
    user(val) {
      this.$socket.emit('join', { room: this.$route.query.room, user: val });
      Tone.start();
    },
  },
  mounted() {
    if (this.user) {
      this.$socket.emit('join', { room: this.$route.query.room, user: this.user });
      Tone.start();
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.fullPath === '/jam') {
      next({
        path: '/jam',
        query: { room: randomstring.generate() },
      });
    } else {
      next();
    }
  },
  methods: {
    activate() {
      this.active = true;
    },
    deactivate() {
      this.active = false;
    },
  },
  sockets: {
    updateUsers(currUsers) {
      this.users = currUsers.filter((user) => user.id !== this.user.id);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'Jam' && window.location.search) {
      this.$socket.emit('leaveRoom', window.location.search);
    }
    next();
  },
};

</script>

<style>
.jam-instrument {
  height: 60vh;
}
</style>
