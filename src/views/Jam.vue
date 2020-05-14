<template>
  <b-container class="jam-page">
    <b-row v-align="start">
      <b-col cols="8" >
        <div class="jam-instrument">
          <Instrument/>
        </div>
      </b-col>
      <b-col cols="4" class="jam-chat">
         <Chat/>
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
  mounted() {
    Tone.start();
    if (!window.location.search) {
      window.location.search = randomstring.generate();
    }
    this.$socket.emit('join', { room: window.location.search, user: 'user' });
  },
  sockets: {
    receiveStart(midi) {
      console.log('start', midi);
      const synth = new Tone.Synth().toMaster();
      this.activeExternalSynths = Object.assign({}, this.activeExternalSynths, { [midi]: synth });
      synth.triggerAttack(note(midi));
      synth.triggerAttack('C4', '+1.0', 0.25);
    },
    receiveStop(midi) {
      console.log('stop', midi);
      this.activeExternalSynths[midi].triggerRelease();
      const removeSynth = { ...this.activeExternalSynths };
      delete removeSynth[midi];
      this.activeExternalSynths = removeSynth;
    },
  },
};

</script>

<style>
.jam-instrument {
  height: 60vh;
}
</style>
