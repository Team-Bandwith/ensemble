<template>
  <div v-show="value">
    <b-container class="select">
      <b-row>
        <b-col>
          <font-awesome-icon
              icon="music"
              class="music align-top"
              size="3x"
              @click="select('piano')"
              src="../assets/piano.png"
          /> <div class="inst-select" @click="select('piano')"
              src="../assets/piano.png">Piano</div>
        </b-col>
        <b-col>
          <!-- <img src="../assets/piano.png" @click="select('piano')"/> -->
          <!-- <img src="../assets/drum.jpg" @click="select('drum')"/> -->
          <font-awesome-icon
              icon="drum"
              class="music align-top"
              size="3x"
              @click="select('drum')"
              src="../assets/drum.jpg"
          /> <div class="inst-select" @click="select('drum')"
              src="../assets/drum.jpg"> Drum Loop</div>
          </b-col>
      </b-row>
    </b-container>
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
  .music {
    color: #fff;
  }
  .select {
    background: #595959;
    padding: 1em;
    color: #FFF;
  }
  .inst-select{
    float: left;
    width: 100%;
  }
  #span{
    color: #fff;
  }
</style>
