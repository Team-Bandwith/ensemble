<template>
  <b-container >
    <b-list-group flush>
      <div class="direct-message">
        <b-list-group-item variant="dark">
          <b-avatar :src="dm.url_avatar" class="mr-3"></b-avatar>
            <span class="mr-auto">
              {{ dm.username }} sent you a message
            </span>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>


// import { request } from 'graphql-request';

export default {
  name: 'DirectMessage',
  props: {
    loggedIn: Boolean,
    dm: Object,
    id: Number,
  },
  components: {

  },
};
</script>
