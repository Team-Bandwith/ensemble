<template>
   <b-container fluid>
    <SaveSong :cloudURL="cloudURL" :id="id" />
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
        <b-col cols="1">
          <div class="record align-top" @click="startRecording">
            <b-spinner class="active" v-show="recording" small type="grow" />
          </div>
        </b-col>
        <b-col cols="1">
          <b-button class="stop align-top"
            variant="dark" v-show="recording" @click="stopRecording" />
        </b-col>
        <b-col>
          <font-awesome-icon
            icon="play"
            class="play align-top"
            size="2x"
            @click="playSong"
            v-if="!recording && !playing && playback"
          />
          <font-awesome-icon
            icon="pause"
            class="pause align-top"
            size="2x"
            @click="pauseSong"
            v-if="playing"
          />
        </b-col>
        <b-col>
          <b-button v-if="!recording && !playing && playback" @click="uploadSong">save</b-button>
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
import axios from 'axios';
// import { request } from 'graphql-request';
import Piano from './Piano.vue';
import SelectInstrument from './SelectInstrument.vue';
import SaveSong from './SaveSong.vue';

export default {
  name: 'Instrument',
  components: {
    Piano,
    SelectInstrument,
    SaveSong,
  },
  props: {
    id: Number,
  },
  data() {
    return {
      selected: null,
      modalOpen: false,
      dest: Tone.context.createMediaStreamDestination(),
      recorder: null,
      chunks: [],
      playback: false,
      recording: false,
      playing: false,
      dataURI: null,
      cloudURL: null,
    };
  },
  mounted() {
    this.recorder = new MediaRecorder(this.dest.stream);
    document.querySelector('audio').onended = () => {
      this.playing = false;
    };
  },
  watch: {
    recorder(rec) {
      rec.ondataavailable = (e) => {
        this.chunks = [...this.chunks, e.data];
      };

      rec.onstop = () => {
        if (this.chunks.length) {
          const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
          document.querySelector('audio').src = URL.createObjectURL(blob);
          this.playback = true;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.dataURI = reader.result;
          };
        }
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
      this.recording = true;
      this.chunks = [];
      this.recorder.start();
    },
    stopRecording() {
      this.recording = false;
      this.recorder.stop();
    },
    playSong() {
      this.playing = true;
      document.querySelector('audio').play();
    },
    pauseSong() {
      this.playing = false;
      document.querySelector('audio').pause();
    },
    uploadSong() {
      axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/song`, { url: this.dataURI })
        .then((res) => {
          this.cloudURL = res.data.url;
          this.$bvModal.show('save-song');
        })
        .catch((err) => console.error(err));
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
  .record {
    height: 30px;
    width: 30px;
    border-radius: 30px;
    background-color: red;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .record:hover {
    cursor: pointer;
    background-color: rgb(201, 5, 5);
  }

  .active {
    height: 50%;
    width: 50%;
  }

  .stop {
    height: 30px;
    width: 30px;
  }

  .play:hover {
    cursor: pointer;
  }

  .pause:hover {
    cursor: pointer;
  }

  audio {
    display: none;
  }

</style>
