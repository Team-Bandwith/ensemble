<template>
  <div v-show="value">
    <img src="../assets/piano.png" @click="select('piano')"/>
    <img src="../assets/drum.jpg" @click="select('drum')"/>
  </div>
</template>

<script>
export default {
  name: 'SelectInstrument',
  props: {
    value: {
      required: true,
    },
  },
  methods: {
    select(instr) {
      this.$emit('select', instr);
      this.$emit('input', !this.value);
    },
  },
};
</script>

<style scoped>
  div {
    float: right;
  }
  img {
    height: 120px;
    width: 225px;
  }
  img:hover {
    cursor: pointer;
  }
</style>
