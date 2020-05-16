<template>
  <b-container>
    <b-row align-h="end">
      <b-button variant="primary">Invite</b-button>
    </b-row>
    <b-row>
      <b-col v-for="user in users" v-bind:key="user.id">
        {{ user.username }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'BandMembers',
  props: {
    users: Array,
  },
};
</script>

<style>

</style>
