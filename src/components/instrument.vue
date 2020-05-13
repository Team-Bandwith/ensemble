<template>
   <b-container fluid>
    <div class="jam">
      <b-row>
        <b-button>Select instrument</b-button>
      </b-row>
      <b-row>
        <div class="instrument">
          <h1>instrument component</h1>
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
export default {
  name: 'Instrument',
  components: {

  },
};
</script>

<style lang="scss">
  jam {
    height: 100%
  }
</style>
