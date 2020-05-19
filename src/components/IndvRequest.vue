<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-request">
        <b-list-group-item variant="dark">
          <b-avatar :src="request.url_avatar" class="mr-3" />
            <span class="mr-auto">
              {{ request.username }} sent you a friend request!
            </span>
            <b-button variant="success">Accept</b-button>
            <b-button variant="danger">Deny</b-button>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>
export default {
  name: 'IndvRequest',
  props: {
    request: Object,
  },
};
</script>

<style>

</style>
