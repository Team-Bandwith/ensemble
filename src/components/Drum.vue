<template>
  <b-container class="drum-toggle">
    <b-row><div id="target"></div></b-row>
    <b-button-group>
      <div class="play-btn">
        <b-button squared @click="playLoop">Play</b-button>
      </div>
      <div class="stop-btn">
        <b-button squared @click="stopLoop">Stop</b-button>
      </div>
      <div class="prompt">*Choose a pattern, then hit play.</div>
    </b-button-group>
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
    Nexus.colors.accent = '#595959';
    Nexus.colors.fill = '#fff';
    this.createSequencer();
    Tone.Master.connect(this.dest);
  },
  methods: {
    toggleIntervalState() {
      this.intervalState = !this.intervalState;
    },
    createSequencer() {
      const sequencer = new Nexus.Sequencer('#target', {
        size: [600, 200],
        mode: 'toggle',
        rows: 2,
        columns: 12,
      });
      sequencer.on('step', (v) => {
        this.col = v;
      });
      // sequencer.colors.fill = 'red';
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
.prompt{
  color: #fff;
  float: right;
  padding: .5em;
}
.play-btn {
  margin-left: -15px;
  margin-top: 10px
}
.stop-btn{
  margin-left: 5px;
  margin-top: 10px
}
</style>
