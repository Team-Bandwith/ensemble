<template>
<b-row>
<b-col>
<div id="piano-keyboard" style="background-color:#0; width:400px; height:210px;"/>
</b-col>
<b-col>
<div id="rack">
  Oscillator:
  <div id="osc" />
  Vibrato Frequency:
  <div id="vibf" />
  Vibrato Depth:
  <div id="vibd" />
</div>
</b-col>
</b-row>
</template>

<script>
import Nexus from 'nexusui';
import Tone from 'tone';
import note from 'midi-note';

export default {
  name: 'Piano',
  props: {
    dest: MediaStreamAudioDestinationNode,
    active: Boolean,
    selected: String,
  },
  data() {
    return {
      vibrato: new Tone.Vibrato({ frequency: 0 }),
      master: Tone.Master,
      oscType: 'triangle',
      vibFreq: 0,
      vibDepth: 0.1,
      destroyed: false,
    };
  },
  beforeDestroy() {
    this.destroyed = true;
  },
  mounted() {
    this.master.connect(this.dest);

    /* eslint-disable no-new */
    new Nexus.Rack('#rack');

    const oscSelect = new Nexus.Select('#osc', {
      options: ['triangle', 'sine', 'sawtooth'],
    });

    oscSelect.on('change', (o) => {
      this.oscType = o.value;
    });

    const vibFreqControl = new Nexus.Dial('#vibf', {
      size: [75, 75],
      interaction: 'radial',
      mode: 'relative',
      min: 0,
      max: 10,
      step: 1,
      value: 0,
    });

    vibFreqControl.on('change', (f) => {
      if (f !== this.vibFreq) {
        this.vibFreq = f;
        this.vibrato = new Tone.Vibrato({ frequency: f, depth: this.vibDepth });
      }
    });

    const vibDepthControl = new Nexus.Dial('#vibd', {
      size: [75, 75],
      interaction: 'radial',
      mode: 'relative',
      min: 0.1,
      max: 1,
      step: 0.1,
      value: 0.1,
    });

    vibDepthControl.on('change', (d) => {
      if (d !== this.vibDepth) {
        this.vibDepth = d;
        this.vibrato = new Tone.Vibrato({ frequency: this.vibFreq, depth: d });
      }
    });


    const activeSynths = {};

    const createPiano = (lowNote, highNote) => {
      const newPiano = new Nexus.Piano('#piano-keyboard', {
        size: [400, 200],
        mode: 'toggle',
        lowNote,
        highNote,
      });

      newPiano.on('change', (k) => {
        if (k.state) {
          this.$socket.emit('startNote', {
            note: k.note,
            vibFreq: this.vibFreq,
            vibDepth: this.vibDepth,
            oscType: this.oscType,
            room: this.$route.query.room,
          });
          const synth = new Tone.Synth({
            oscillator: { type: this.oscType },
          });
          synth.chain(this.vibrato, Tone.Master);
          activeSynths[k.note] = synth;
          synth.triggerAttack(note(k.note));
        } else {
          this.$socket.emit('stopNote', { note: k.note, room: this.$route.query.room });
          activeSynths[k.note].triggerRelease();
          delete activeSynths[k.note];
        }
      });

      return newPiano;
    };

    const keyMapper = {
      a: 0,
      w: 1,
      s: 2,
      e: 3,
      d: 4,
      f: 5,
      t: 6,
      g: 7,
      y: 8,
      h: 9,
      u: 10,
      j: 11,
      k: 12,
    };

    let lowNote = 72;
    let highNote = 84;
    let piano = createPiano(lowNote, highNote);


    document.addEventListener('keydown', (event) => {
      if (!this.active || this.destroyed || window.location.pathname !== '/jam') {
        return;
      }
      const keyIndex = keyMapper[event.key];
      /* eslint-disable no-unused-expressions */
      /* eslint-disable  no-underscore-dangle */
      keyIndex !== undefined && !piano.keys[keyIndex]._state.state
        ? piano.toggleIndex(keyIndex, true) : null;
      if (event.key === ',') {
        if (lowNote > 24) {
          piano.destroy();
          highNote = lowNote;
          lowNote -= 12;
          piano = createPiano(lowNote, highNote);
        }
      }

      if (event.key === '.') {
        if (highNote < 120) {
          piano.destroy();
          lowNote = highNote;
          highNote += 12;
          piano = createPiano(lowNote, highNote);
        }
      }
    });

    document.addEventListener('keyup', (event) => {
      const keyIndex = keyMapper[event.key];
      keyIndex !== undefined && piano.keys[keyIndex]._state.state
        ? piano.toggleIndex(keyIndex, false) : null;
    });
  },
};
</script>
