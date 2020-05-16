<template>
  <b-container>
    <b-row align-h="end">
      <b-button variant="primary">Invite</b-button>
    </b-row>
    <b-row>
      <b-col v-for="user in users" v-bind:key="user.id">
        <span>{{ user.username }}</span>
        <img v-if="user.url_avatar" :src="user.url_avatar" />
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
