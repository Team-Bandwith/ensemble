<template>
   <b-container fluid>
    <SaveSong :cloudURL="cloudURL" :id="id" :users="users" v-on:active="activate" />
    <div class="jam">
      <b-row>
        <b-button squared class="btn" @click="openModal">Select instrument</b-button>
      </b-row>
      <b-row>
        <SelectInstrument v-model="modalOpen" v-on:select="select" />
        <div class="instrument">
          <Piano v-if="selected === 'piano'" :dest="dest" :active="active" />
          <Drum v-if="selected === 'drum'" :dest="dest" :active="active" />
        </div>
        <audio controls />
      </b-row>
      <b-row align-v="end" class="tools">
        <b-col cols="1">
          <div class="record align-top" @click="startRecording">
            <b-spinner class="active" v-show="recording" small type="grow" />
          </div>
        </b-col>
        <b-col cols="1">
          <b-button class="stop align-top"
            variant="dark" v-show="recording" @click="stopRecording" />
        </b-col>
        <b-col cols="1" v-show="recording">
          <div class="playback-string">
            {{ playbackString }}
          </div>
        </b-col>
        <b-col>
          <font-awesome-icon
            icon="play"
            class="play align-top"
            size="2x"
            @click="playSong"
            v-if="!recording && playback && paused"
          />
          <font-awesome-icon
            icon="pause"
            class="pause align-top"
            size="2x"
            @click="pauseSong"
            v-if="!paused"
          />
          <span v-if="playing">
              <div class="playback-string">{{ playbackString }}</div>
          </span>
        </b-col>
        <b-col>
          <b-button v-if="!recording && !playing && playback" @click="uploadSong">save</b-button>
        </b-col>
        </b-row>
        <div v-show="showProgress">
          <loading-progress
            indeterminate
            shape="line"
            size="500"
            width="400"
            height="15"
            fill-duration="2"
          />
        </div>
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
import Drum from './Drum.vue';
import Piano from './Piano.vue';
import SelectInstrument from './SelectInstrument.vue';
import SaveSong from './SaveSong.vue';

export default {
  name: 'Instrument',
  components: {
    Piano,
    Drum,
    SelectInstrument,
    SaveSong,
  },
  props: {
    id: Number,
    active: Boolean,
    users: Array,
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
      showProgress: false,
      playbackTime: 0,
      playbackString: '0:00',
      playbackTimer: null,
      paused: true,
      master: Tone.Master,
      instruments: ['C3', 'C4'],
      synths: [
        new Tone.MembraneSynth().toMaster(),
        new Tone.MembraneSynth().toMaster(),
      ],
    };
  },
  mounted() {
    this.master.connect(this.dest);

    this.recorder = new MediaRecorder(this.dest.stream);
    document.querySelector('audio').onended = () => {
      this.playing = false;
      clearInterval(this.playbackTimer);
      this.paused = true;
      this.playbackTime = 0;
      this.playbackString = '0:00';
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
    playing(val) {
      if (val) {
        this.playbackTimer = setInterval(() => {
          this.playbackTime += 1;
        }, 1000);
      }
    },
    recording(val) {
      if (val) {
        this.playbackTimer = setInterval(() => {
          this.playbackTime += 1;
        }, 1000);
      }
    },
    paused(val) {
      if (this.playbackTimer) {
        clearInterval(this.playbackTimer);
      }
      if (!val) {
        this.playbackTimer = setInterval(() => {
          this.playbackTime += 1;
        }, 1000);
      }
    },
    playbackTime(val) {
      if (val < 10) {
        this.playbackString = `0:0${val}`;
      } else if (val < 60) {
        this.playbackString = `0:${val}`;
      } else {
        const minutes = Math.floor(val / 60);
        const seconds = val % 60;
        if (seconds < 10) {
          this.playbackString = `${minutes}:0${seconds}`;
        } else {
          this.playbackString = `${minutes}:${seconds}`;
        }
      }
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
      clearInterval(this.playbackTimer);
      this.playbackString = '0:00';
      this.playbackTime = 0;
      this.recorder.stop();
    },
    playSong() {
      this.playing = true;
      this.paused = false;
      document.querySelector('audio').play();
    },
    pauseSong() {
      this.paused = true;
      clearInterval(this.playbackTimer);
      document.querySelector('audio').pause();
    },
    uploadSong() {
      axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/song`, { url: this.dataURI })
        .then((res) => {
          this.showProgress = true;
          this.cloudURL = res.data.url;
          this.$emit('deact');
          this.$bvModal.show('save-song');
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setTimeout(
            () => {
              this.showProgress = false;
            },
            5000,
          );
        });
    },
    activate() {
      this.$emit('active');
    },
  },
  sockets: {
    receiveStartDrum({
      drum: d,
    }) {
      this.synths[d].triggerAttackRelease(this.instruments[d], '8n');
    },
    receiveStart({
      note: midi,
      vibFreq,
      vibDepth,
      oscType,
    }) {
      const vibrato = new Tone.Vibrato({ frequency: vibFreq, depth: vibDepth });
      const synth = new Tone.Synth({
        oscillator: { type: oscType },
      });
      synth.chain(vibrato, this.master);
      this.activeExternalSynths = Object.assign({}, this.activeExternalSynths, { [midi]: synth });
      synth.triggerAttack(note(midi));
    },
    receiveStop(midi) {
      this.activeExternalSynths[midi].triggerRelease();
      const removeSynth = { ...this.activeExternalSynths };
      delete removeSynth[midi];
      this.activeExternalSynths = removeSynth;
    },
  },
};
</script>

<style lang="scss">
@import 'node_modules/@jurajkavka/vue-hamburger-button/src/scss/default-theme.scss';

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
    border: #3a3836;
    border-block-color: #3a3836;
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
  .btn {
    background-color: #98AC9E;
  }
  .tools{
    background: #595959;
    padding: 1em;
  }
  .playback-string {
    color: #fff;
  }
</style>
