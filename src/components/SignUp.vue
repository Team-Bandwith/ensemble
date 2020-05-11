<template>
  <div class="modal" v-show="value">
    <div class="container">
      <div class="modal__title">Sign Up:</div>
      <input v-model="email" placeholder="enter email" />
      <p>username is: {{ email }}</p>
      <input v-model="password" placeholder="enter password" />
      <p>password is: {{ password }}</p>
      <button class="btn">Submit</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SignUp',
  props: {
    value: {
      required: true,
    },
    methods: {
      close() {
        this.$emit('input', !this.value);
      },
    },
  },
};
</script>
<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
