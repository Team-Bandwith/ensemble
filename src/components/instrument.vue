<template>
   <b-container class="jam">
    <b-row>
      <button>Select instrument</button>
    </b-row>
    <b-row>
      <div class="instrument">
        <h1>instrument component</h1>
      </div>
    </b-row>
    <b-row align-v="end">
      <b-col>
        <button>rec / stop</button>
      </b-col>
      <b-col>
        <button>play / pause</button>
      </b-col>
      <b-col>
        <button> save </button>
      </b-col>
      </b-row>
    </b-container>
</template>

<script>
export default {
  name: 'Instrument',
  components: {

  },
};
</script>

<style lang="scss">

</style>
