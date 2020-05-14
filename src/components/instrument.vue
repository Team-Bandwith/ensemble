<template>
   <b-container fluid>
    <div class="jam">
      <b-row>
        <b-button @click="openModal">Select instrument</b-button>
      </b-row>
      <b-row>
        <SelectInstrument v-model="modalOpen" v-on:select="select" />
        <div class="instrument">
          <Piano v-if="selected === 'piano'" :dest="dest" />
        </div>
        <audio controls />
      </b-row>
      <b-row align-v="end">
        <b-col>
          <b-button variant="danger" @click="startRecording">
            <b-spinner small type="grow"></b-spinner>
          </b-button>
          <b-button variant="danger" @click="stopRecording">
            <b-spinner small type="grow"></b-spinner>
          </b-button>
        </b-col>
        <b-col>
          <b-button>play / pause</b-button>
        </b-col>
        <b-col>
          <b-button> save </b-button>
        </b-col>
        </b-row>
      </div>
    </b-container>
</template>

<script>
/* eslint-disable prefer-object-spread */
/* eslint-disable no-param-reassign */
import Tone from 'tone';
import note from 'midi-note';
import Piano from './Piano.vue';
import SelectInstrument from './SelectInstrument.vue';

export default {
  name: 'Instrument',
  components: {
    Piano,
    SelectInstrument,
  },
  data() {
    return {
      selected: null,
      modalOpen: false,
      dest: Tone.context.createMediaStreamDestination(),
      recorder: null,
      chunks: [],
    };
  },
  mounted() {
    // this.recorder = new MediaRecorder(this.dest.stream)
    //   .ondataavailable((e) => {
    //     this.chunks = [...this.chunks, e.data];
    //   })
    //   .onstop(() => {
    //     const blob = new Blob(this.chunks, { type: 'audio/mpeg-3' });
    //     document.querySelector('audio').src = blob;
    //   });
    this.recorder = new MediaRecorder(this.dest.stream);
  },
  watch: {
    recorder(rec) {
      rec.ondataavailable = (e) => {
        this.chunks = [...this.chunks, e.data];
      };

      rec.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
        document.querySelector('audio').src = URL.createObjectURL(blob);
        this.chunks = [];
      };
    },
  },
  methods: {
    select(instr) {
      this.selected = instr;
    },
    openModal() {
      this.modalOpen = !this.modalOpen;
    },
    startRecording() {
      this.recorder.start();
    },
    stopRecording() {
      this.recorder.stop();
    },
  },
  sockets: {
    receiveStart(midi) {
      console.log('start', midi);
      const synth = new Tone.Synth().toMaster();
      synth.connect(this.dest);
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
  },
};
</script>

<style lang="scss">
  jam {
    height: 100%
  }
</style>
