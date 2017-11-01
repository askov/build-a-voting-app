<template>
<div id="app" class="content-wrapper">
  <header>
    <Navbar />
  </header>
  <div class="content">
    <router-view />
  </div>
  <AppFooter />
</div>
</template>

<script>
import Navbar from './Navbar';
import AppFooter from './AppFooter';

export default {
  name: 'app',
  components: {
    Navbar,
    AppFooter
  }
};
</script>

<style lang="stylus">
@import "../stylus/theme"

*
  margin 0
  padding 0
  font-family 'Josefin Sans', sans-serif
  font-size 18px

html, body
  height 100%
  width 100%

body
  overflow-x hidden // animate.css fix
  text-align center
  background-image url("/static/background.png")

.content-wrapper
  display flex
  flex-direction column
  min-height 100%

.content
  flex 1

</style>
