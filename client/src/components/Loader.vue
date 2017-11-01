<template>
<div v-if="isPending" class="loader"></div>
</template>

<script>

export default {
  name: 'loader',
  computed: {
    isPending() {
      return this.$store.getters.pending;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"

.loader
  width 32px
  height 32px
  border-radius 50%
  background-color $loader-color
  margin 30vh auto
  -webkit-animation fading-away 1.7s infinite ease-in-out
  animation fading-away 1.7s infinite ease-in-out

@keyframes fading-away
  0%
    -webkit-transform scale(1)
  50%
    -webkit-transform scale(0)
    opacity 0
  100%
    -webkit-transform scale(1)
    opacity 1

@keyframes fading-away
  0%
    transform scale(1)
    -webkit-transform scale(1)
  50%
    transform scale(0)
    -webkit-transform scale(0)
    opacity 0
  100%
    transform scale(1)
    -webkit-transform scale(1)
    opacity 1
</style>
