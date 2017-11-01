<template>
<div class="form-wrapper">
  <h2>Sign in and begin creating polls.</h2>
  <form v-on:submit.prevent="login">
    <div class="form-line">
      <i class="fa fa-envelope-o" aria-hidden="true"></i>
      <input type="text"
            name="email"
            placeholder="e-mail *"
            v-model="email"
      >
    </div>
    <div class="form-line">
      <i class="fa fa-key" aria-hidden="true"></i>
      <input type="password"
            name="password"
            placeholder="Password *"
            v-model="password"
      >
    </div>
    <input type="submit" value="Log in">
  </form>
  <Loader />
</div>
</template>

<script>
import Loader from './Loader';

export default {
  name: 'login',
  components: {
    Loader
  },
  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      }).then(() => {
        this.$router.push('/');
      }).catch(() => {
        this.$router.push('/login-error');
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/form"
@import "../stylus/theme"

input[type="text"], input[type="password"]
  border-bottom-color $login-color

input[type="submit"]
  background-color $login-color

.form-line > i
    color $login-color
</style>
