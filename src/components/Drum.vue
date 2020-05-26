<template>
  <b-container>
    <b-row><div id="target"></div></b-row>
    <div>
      <b-row><b-button @click="playLoop">play loop</b-button></b-row>
    </div>
    <div>
      <b-row><b-button @click="stopLoop">stop loop</b-button></b-row>
    </div>
  </b-container>
</template>
<script>
import Tone from 'tone';
import Nexus from 'nexusui';

export default {
  name: 'Drum',
  props: {
    dest: MediaStreamAudioDestinationNode,
  },
  data() {
    return {
      intervalState: false,
      sequencer: null,
      instruments: ['C3', 'C4'],
      synths: [
        new Tone.MembraneSynth().toMaster(),
        new Tone.MembraneSynth().toMaster(),
      ],
      col: null,
      transport: null,
    };
  },
  mounted() {
    this.createSequencer();
    Tone.Master.connect(this.dest);
  },
  methods: {
    toggleIntervalState() {
      this.intervalState = !this.intervalState;
    },
    createSequencer() {
      const sequencer = new Nexus.Sequencer('#target', {
        size: [400, 200],
        mode: 'toggle',
        rows: 2,
        columns: 10,
      });
      sequencer.on('step', (v) => {
        this.col = v;
      });
      this.sequencer = sequencer;
    },
    playLoop() {
      if (this.transport === null) {
        this.transport = Tone.Transport.scheduleRepeat((time) => {
          this.sequencer.next();
          this.col.forEach((state, i) => {
            if (state) {
              this.$socket.emit('startDrum', {
                drum: i,
                room: this.$route.query.room,
              });
              this.synths[i].triggerAttackRelease(this.instruments[i], '8n', time);
            }
          });
        }, '0.5');
      }
      Tone.Transport.start();
    },
    stopLoop() {
      Tone.Transport.stop();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
