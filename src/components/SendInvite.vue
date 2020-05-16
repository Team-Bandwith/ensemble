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
    <b-button @click="send">Send</b-button>
  </div>
</template>

<script>
import { request } from 'graphql-request';

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
    you: Object,
  },
  methods: {
    rsvp(user) {
      this.toInvite = [...this.toInvite, user];
    },
    unrsvp(user) {
      this.toInvite = this.toInvite.filter((usr) => usr.id !== user.id);
    },
    send() {
      Promise.all(this.toInvite.map((usr) => {
        const query = `
  mutation {
    sendInvite(id_user_to: ${usr.id}, id_user_from: ${this.you.id}, link: "${window.location.search}") {
      id
    }
  }
`;
        return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query);
      }))
        .then(() => this.$emit('input', false))
        .catch((err) => console.log(err));
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
