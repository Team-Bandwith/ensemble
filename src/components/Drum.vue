<template>
  <b-container>
    <b-row>
        <div id="seq" />
        <div id="rack1">
        <div v-for="n in 3" :id="`select${3 - n + 1}`" :key="`select${n}`" />
        </div>
        <div id="rack2">
        <div title="Pitch Decay" v-for="n in 3" :id="`pd${3 - n + 1}`" :key="`pd${n}`" />
        </div>
        <div id="rack3">
        <div title="Resonance" v-for="n in 3" :id="`oct${3 - n + 1}`" :key="`oct${n}`" />
        </div>
        <div id="rack4">
        <div title="Attack" v-for="n in 3" :id="`att${3 - n + 1}`" :key="`att${n}`" />
        </div>
        <div id="rack5">
        <div title="Decay" v-for="n in 3" :id="`dec${3 - n + 1}`" :key="`dec${n}`" />
        </div>
      </b-row>
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
import _ from 'lodash';

export default {
  name: 'Drum',
  props: {
    dest: MediaStreamAudioDestinationNode,
  },
  data() {
    return {
      intervalState: false,
      sequencer: null,
      instruments: ['C1', 'C2', 'G2'],
      vols: [1, 1, 0.5],
      synths: [
        new Tone.MembraneSynth({
          pitchDecay: 0.15,
          octaves: 13,
          envelope: {
            attack: 0.01,
            decay: 0.55,
          },
        }).toMaster(),
        new Tone.MembraneSynth({
          oscillator: { type: 'triangle' },
          pitchDecay: 0.05,
          envelope: {
            attack: 0.02,
            decay: 0.35,
          },
        }).toMaster(),
        new Tone.MembraneSynth({
          oscillator: { type: 'sawtooth' },
        }).toMaster(),
      ],
      col: null,
      transport: null,
    };
  },
  mounted() {
    Nexus.colors.accent = '#595959';
    Nexus.colors.fill = '#fff';
    Tone.Transport.on('stop', () => console.log('STOP'));
    Tone.Transport.on('pause', () => console.log('pause'));
    document.documentElement.addEventListener('mousedown', () => {
      if (Tone.context.state !== 'running') Tone.context.resume();
    });

    this.createSequencer();

    Tone.Master.connect(this.dest);
    /* eslint-disable no-new */
    new Nexus.Rack('#rack1');
    new Nexus.Rack('#rack2');
    new Nexus.Rack('#rack3');
    new Nexus.Rack('#rack4');
    new Nexus.Rack('#rack5');

    for (let i = 1; i < 4; i += 1) {
      const select = new Nexus.Select(`#select${i}`, {
        options: ['sine', 'triangle', 'sawtooth', 'square'],
      });

      select.selectedIndex = i - 1;

      select.on('change', (s) => {
        this.synths[i - 1].set('oscillator.type', s.value);
        const vols = [...this.vols];
        if (s.value === 'square' || s.value === 'sawtooth') {
          vols[i - 1] = 0.5;
        } else {
          vols[i - 1] = 1;
        }
        this.vols = vols;
      });
    }

    for (let i = 1; i < 4; i += 1) {
      const pitchDecay = new Nexus.Dial(`#pd${i}`, {
        size: [30, 30],
        min: 0.05,
        max: 0.15,
        step: 0.01,
        value: this.synths[i - 1].pitchDecay,
      });

      pitchDecay.on('change', (v) => {
        if (this.synths[i - 1].pitchDecay !== v) {
          this.synths[i - 1].set('pitchDecay', v);
        }
      });
    }

    for (let i = 1; i < 4; i += 1) {
      const octaves = new Nexus.Dial(`#oct${i}`, {
        size: [30, 30],
        min: 5,
        max: 15,
        step: 1,
        value: this.synths[i - 1].octaves,
      });

      octaves.on('change', (v) => {
        if (this.synths[i - 1].octaves !== v) {
          this.synths[i - 1].set('octaves', v);
        }
      });
    }

    for (let i = 1; i < 4; i += 1) {
      const attack = new Nexus.Dial(`#att${i}`, {
        size: [30, 30],
        min: 0.001,
        max: 0.2,
        step: 0.01,
        value: this.synths[i - 1].envelope.attack,
      });

      const changeAttack = _.debounce((val) => {
        this.synths[i - 1].set('envelope.attack', val);
      }, 500);

      attack.on('change', (a) => {
        changeAttack(a);
      });
    }

    for (let i = 1; i < 4; i += 1) {
      const decay = new Nexus.Dial(`#dec${i}`, {
        size: [30, 30],
        min: 0.1,
        max: 1,
        step: 0.05,
        value: this.synths[i - 1].envelope.decay,
      });

      const changeDecay = _.debounce((val) => {
        this.synths[i - 1].set('envelope.decay', val);
      }, 500);

      decay.on('change', (a) => {
        changeDecay(a);
      });
    }
  },
  methods: {
    toggleIntervalState() {
      this.intervalState = !this.intervalState;
    },
    createSequencer() {
      const sequencer = new Nexus.Sequencer('#seq', {
        size: [400, 90],
        mode: 'toggle',
        rows: 3,
        columns: 16,
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
              // const synth = new Tone.MembraneSynth().toMaster();
              this.synths[i].triggerAttackRelease(this.instruments[i], '8n', time, this.vols[i]);
            }
          });
        }, '0.25');
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
