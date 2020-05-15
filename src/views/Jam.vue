<template>
  <b-container class="jam-page">
    <b-row v-align="start">
      <b-col cols="8" >
        <div class="jam-instrument">
          <Instrument/>
        </div>
      </b-col>
      <b-col cols="4" class="jam-chat">
         <Chat :user="user"/>
      </b-col>
    </b-row>
    <b-row align-v="end" >
      <b-col class="jam-band">
        <BandMembers/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable prefer-object-spread */
/* eslint-disable camelcase */
import Tone from 'tone';
import note from 'midi-note';
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
    receiveStart(midi) {
      console.log('start', midi);
      const synth = new Tone.Synth().toMaster();
      this.activeExternalSynths = Object.assign({}, this.activeExternalSynths, { [midi]: synth });
      synth.triggerAttack(note(midi));
    },
    receiveStop(midi) {
      console.log('stop', midi);
      this.activeExternalSynths[midi].triggerRelease();
      const removeSynth = { ...this.activeExternalSynths };
      delete removeSynth[midi];
      this.activeExternalSynths = removeSynth;
    },
    connect() {
      // Fired when the socket connects.
      console.log('there is a connection');
    },

    disconnect() {
      console.log('connection lost');
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
    },
  },
};

</script>

<style>
.jam-instrument {
  height: 60vh;
}
</style>
