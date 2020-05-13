<template>
  <b-container class="jam-page">
    <b-row v-align="start">
      <b-col cols="8" >
        <div class="jam-instrument">
          <Instrument/>
        </div>
      </b-col>
      <b-col cols="4" class="jam-chat">
         <Chat/>
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
import Instrument from '../components/instrument.vue';
import Chat from '../components/chat.vue';

export default {
  name: 'jam',
  components: {
    Instrument,
    Chat,
  },
};

</script>

<style>
.jam-instrument {
  height: 60vh;
}
</style>
