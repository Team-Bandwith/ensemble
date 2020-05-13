<template>
   <b-container fluid>
    <div class="jam">
      <b-row>
        <b-button>Select instrument</b-button>
      </b-row>
      <b-row>
        <div class="instrument">
          <Piano />
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

export default {
  name: 'Instrument',
  components: {
    Piano,
  },
};
</script>

<style lang="scss">
  jam {
    height: 100%
  }
</style>
