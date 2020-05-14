<template>
   <b-container fluid>
    <div class="jam">
      <b-row>
        <b-button @click="openModal">Select instrument</b-button>
      </b-row>
      <b-row>
        <SelectInstrument v-model="modalOpen" v-on:select="select" />
        <div class="instrument">
          <Piano v-if="selected === 'piano'" />
        </div>
      </b-row>
      <b-row align-v="end">
        <b-col>
          <b-button variant="danger" v-on="click">
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
    };
  },
  methods: {
    select(instr) {
      this.selected = instr;
    },
    openModal() {
      this.modalOpen = !this.modalOpen;
    },
  },
};
</script>

<style lang="scss">
  jam {
    height: 100%
  }
</style>
