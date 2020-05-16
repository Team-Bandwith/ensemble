<template>
  <div v-show="value">
    <div v-for="user in online" :key="user.id">
      <img
        v-if="!toInvite.map((usr) => usr.id).includes(user.id)"
        :src="user.url_avatar"
        @click="rsvp(user)"
      >
      <img
        v-else
        :src="user.url_avatar" class="selected"
        @click="unrsvp(user)"
      >
      {{ user.username }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendInvite',
  data() {
    return {
      toInvite: [],
    };
  },
  props: {
    value: {
      required: true,
    },
    online: Array,
  },
  methods: {
    rsvp(user) {
      this.toInvite = [...this.toInvite, user];
    },
    unrsvp(user) {
      this.toInvite = this.toInvite.filter((usr) => usr.id !== user.id);
    },
  },
  watch: {
    toInvite(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped>
div {
  background-color: gray;
}

img {
  height: 100px;
  width: 100px;
}
.selected {
  border-color: green;
  border-style: solid;
}
</style>
