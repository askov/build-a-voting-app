<template>
<div class="login-error">
  <h2>Authentication error
    <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
  </h2>
  <p>The email address or password you entered is not valid.</p> 
</div>
</template>

<script>
export default {
  name: 'loginError'
};
</script>

<style lang="stylus" scoped>
.login-error
  padding 2em 1em
  margin 5em auto
  background-color orange
</style>
