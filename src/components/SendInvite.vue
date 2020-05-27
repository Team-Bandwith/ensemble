<template>
  <div id="invite-container" v-show="value">
    <div inline>
      <b-row>
        <div class="col-sm-8"><h5>Select an Online Friend</h5></div>
        <button
        id="send"
        @click="send"
        squared
        type='submit'>Send Invite</button>
      </b-row>
    </div>
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
h5 {
  color: white;
}
  #invite-container {
    background-color: #3B3836;
    border-radius: 2px;
    padding: 20px;
    width: 700px;
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
    border-style: none;
    border-radius: 0px;
    margin-left: 110px;
    padding-top: 6px;
    padding-right: 12px;
    padding-bottom: 6px;
    padding-left: 12px;
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
