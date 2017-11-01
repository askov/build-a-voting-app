<template>
<div>
  <div class="block-container">
    <router-link to="/signup" class="block-left">
      <i class="fa fa-users fa-5x" aria-hidden="true"></i>
      <h2 class="animated bounceIn">
        Join us now to begin creating polls &ndash; it's free and easy
      </h2>
    </router-link>
    <div class="block-center" v-show="cnt>=1">
      <i class="fa fa-pie-chart fa-5x" aria-hidden="true"></i>
      <h2 class="animated bounceIn">
        Make your live polls &ndash; they are instantly available
        online after creation
      </h2>
    </div>
    <div class="block-right" v-show="cnt>=2">
      <i class="fa fa-retweet fa-5x" aria-hidden="true"></i>
      <h2 class="animated bounceIn">
        Share whatever poll you want with friends via Twitter
      </h2>
    </div>
  </div>
  <div v-show="cnt>=3">
    <h3 class="recent-polls animated pulse">
      <i class="fa fa-clock-o" aria-hidden="true"></i> Recent polls
    </h3>
    <Polls :fetchUrl="apiHost" />
    <router-link to="/polls" class="animated pulse infinite more-polls">
      <i class="fa fa-search" aria-hidden="true"></i>
      <span>More polls...</span>
    </router-link>
  </div>
</div>
</template>

<script>
import Polls from './Polls';

export default {
  name: 'home',
  components: {
    Polls
  },
  data: function() {
    return {
      cnt: 0,
      /* eslint-disable no-undef */
      apiHost: API_URL + 'recent-polls'
    };
  },
  mounted: function() {
    this.interval = setInterval(this.incCounter, 500);
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },
  methods: {
    incCounter() {
      this.cnt += 1;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"

.block-left
.block-center
.block-right
  text-decoration none
  display block
  padding 0
  width 30%

.block-left
  color #428cf4

.block-center
  color #318e69

.block-right
  color #a27ddb

.block-container
  margin 1em 0
  display flex
  flex-direction row
  justify-content center

a
  padding 0.5em

.more-polls
  width 80%
  max-width 800px
  margin 1em auto

.recent-polls
  background-color $navbar-color
  color white
  padding 0.5em

@media screen and (max-width: 600px)
  .block-container
    display block
    div, a
      width 100%
      padding-top 10px
</style>
