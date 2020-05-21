<template>
  <div>
    bass:
  <b-button @click="makeBassSound"></b-button>
    <br>
    snare:
  <b-button @click="makeSnareSound"></b-button>
    <br>
  <b-row>
    <div v-for="row in rows" :key="row">
      <input type="checkbox">
    </div>
  </b-row>
  <b-row>
    <b-button @click="playLoop">play loop</b-button>
  </b-row>
  <b-row><div id="target"></div></b-row>
  </div>

</template>
<script>
import Tone from 'tone';
import Nexus from 'nexusui';

export default {
  name: 'Drum',
  props: {
  },
  data() {
    return {
      index: 0,
      rows: [1, 2, 3, 4],
    };
  },
  mounted() {
    this.createSequencer();
  },
  methods: {
    createSequencer() {
      console.log('created');
      const sequencer = new Nexus.Sequencer('#target', {
        size: [400, 200],
        mode: 'toggle',
        rows: 5,
        columns: 10,
      });
      console.log(sequencer);
    },
    makeBassSound() {
      const synth = new Tone.MembraneSynth();
      synth.toMaster();
      synth.triggerAttackRelease('C2', '8n');
    },
    makeSnareSound() {
      const synth = new Tone.MembraneSynth();
      synth.toMaster();
      synth.triggerAttackRelease('G3', '8n');
    },
    playLoop() {
      const beat = document.body.querySelectorAll('input[type="checkbox"]');
      const clock = new Tone.Clock(() => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < beat.length; i++) {
          if (beat[i].checked) {
            this.makeBassSound();
          }
        }
      }, 1);
      clock.start();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
