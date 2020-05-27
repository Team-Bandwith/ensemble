<template>
  <div id="invite-container" v-show="value">
    <b-col v-for="user in online" :key="user.id" id="invite-users">
      <div id="center-wrapper">
        <img
          v-if="!toInvite.map((usr) => usr.id).includes(user.id)"
          :src="user.url_avatar"
          @click="rsvp(user)"
        >
        <img
          v-else
          :src="user.url_avatar"
          class="selected"
          @click="unrsvp(user)"
        >
        <div id="invite-name">
        {{ user.username }}
        </div>
      </div>
    </b-col>
    <b-col cols="2">
      <button id="send" @click="send" squared class="btn" type='submit'>Send</button>
    </b-col>
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
      console.log('click');
      this.toInvite = [...this.toInvite, user];
    },
    unrsvp(user) {
      this.toInvite = this.toInvite.filter((usr) => usr.id !== user.id);
    },
    send() {
      Promise.all(this.toInvite.map((usr) => {
        this.$socket.emit('notify', usr.id);
        const query = `
        mutation {
          sendInvite(id_user_to: ${usr.id}, id_user_from: ${this.you.id}, link: "${window.location.search}") {
            id
          }
        }
      `;
        return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query);
      }))
        .then(() => {
          this.$emit('input', false);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
  #invite-container {
    background-color: #3B3836;
    border-radius: 5px;
  }
  #invite-name {
    color: #99aca0;
    text-align: center;
  }
  #invite-users {
    margin-top: 10px;
  }
  #center-wrapper {
    margin: auto;
  }
  #send {
    background-color: #6d8657;
    border-color: #6d8657;
    color: white;
    margin: 10px;
    border-style: none;
    border-radius: 0px;
  }
  .selected {
    border-color: #6d8657;
    border-style: solid;
  }
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
