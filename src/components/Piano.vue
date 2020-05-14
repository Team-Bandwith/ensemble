<template>
  <div id="piano-keyboard" />
</template>

<script>
import Nexus from 'nexusui';
import Tone from 'tone';
import note from 'midi-note';

export default {
  name: 'Piano',
  data() {
    return {
      activeExternalSynths: {},
    };
  },
  mounted() {
    const activeSynths = {};

    const createPiano = (lowNote, highNote) => {
      const newPiano = new Nexus.Piano('#piano-keyboard', {
        size: [300, 125],
        mode: 'toggle',
        lowNote,
        highNote,
      });

      newPiano.on('change', (k) => {
        if (k.state) {
          this.$socket.emit('startNote', { note: k.note, room: window.location.search });
          const synth = new Tone.Synth().toMaster();
          activeSynths[k.note] = synth;
          synth.triggerAttack(note(k.note));
        } else {
          this.$socket.emit('stopNote', { note: k.note, room: window.location.search });
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
