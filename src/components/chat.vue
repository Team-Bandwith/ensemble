<template>
  <b-container fluid>
    <div class="chat">
      <b-row>
       <div class="messages">
         <h4>Chat</h4>
       </div>
      </b-row>
      <b-row align-v="end">
        <b-form>
          <div>
            <b-form inline>
              <label class="sr-only" for="inline-form-input-name">Name</label>
                <b-input
                id="inline-form-input-name"
                placeholder="Chat"
              ></b-input>
                <b-button variant="primary">Send</b-button>
            </b-form>
          </div>
        </b-form>
      </b-row>
      </div>
    </b-container>
</template>

<script>
export default {
  name: 'Chat',
  component: {

  },
};
</script>

<style>

</style>
