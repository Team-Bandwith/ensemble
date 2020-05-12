<template>
  <b-container class="jam">
    <b-row v-align="start">
      <b-col cols="8" >
        <div class="jam-instrument">
          <h1>instrument component</h1>
        </div>
      </b-col>
      <b-col cols="4" class="jam-chat">
          <h1>chat component</h1>
      </b-col>
    </b-row>
    <b-row align-v="end" >
      <b-col class="jam-band">
        <h1>band members component</h1>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      name: '',
    };
  },
};
</script>

<style>
.jam-instrument {
  height: 60vh;
}
</style>
