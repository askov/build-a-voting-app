<template>
<div class="nav-wrapper">
  <nav>
    <router-link to="/" class="logo-wrapper">
      <img src="/static/logo.png" alt="enterpoll">
    </router-link>
    <ul :class="{hidden: isMenuHidden}">
      <li v-if="!isLoggedIn">
        <router-link to="/login">
          <i class="fa fa-sign-in" aria-hidden="true"></i>
          Log in
        </router-link>
      </li>
      <li v-if="!isLoggedIn">
        <router-link to="/signup">
          <i class="fa fa-user-plus" aria-hidden="true"></i>
          Sign up
        </router-link>
      </li>
      <li v-if="isLoggedIn">
        <a href="#" @click="logout">
          <i class="fa fa-sign-out" aria-hidden="true"></i>
          Log out
        </a>
      </li>
      <li v-if="isLoggedIn">
        <a href="#">
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>
          <em>Welcome, {{userName}}</em>
        </a>
      </li>
      <li v-if="isLoggedIn">
        <router-link to="/my-polls">
          <i class="fa fa-list" aria-hidden="true"></i>
          My polls
        </router-link>
      </li>
      <li>
        <router-link
          to="/polls"
          class="animated flash live"
        >
          <i class="fa fa-pie-chart" aria-hidden="true"></i>
          Polls live
        </router-link>
      </li>
    </ul>
    <button class="mobile-menu-icon" @click="toggleMenuVisibility">
      <span></span><span></span><span></span>
    </button>
  </nav>
</div>
</template>

<script>
export default {
  name: 'navbar',
  data: function() {
    return {
      isMenuHidden: true
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    //   .then(() => {
    //     this.$router.push('/')
    //   })
    },
    toggleMenuVisibility() {
      this.isMenuHidden = !this.isMenuHidden;
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userName() {
      return this.$store.getters.userName;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"

.mobile-menu-icon
  display none
  width 20px
  height 20px
  top 18px
  right 18px
  position absolute
  color white
  span
    display block
    height 4px
    background $light-text-color
    &:nth-child(2)
      margin 4px 0

.live
  background-color #318e69

.nav-wrapper
  background-image url("/static/ui.png")

.logo-wrapper
  margin-right auto
  
nav
  position relative
  display flex
  width 100%
  max-width 1100px
  margin 0 auto
  img
    height 36px
    padding 10px
    display inline-block

ul
  display flex
  list-style none
  flex-direction row-reverse
  li
    display flex
    align-items center
    a
      font-weight bold
      color $light-text-color
      text-decoration none
      padding 5px 10px
    &:first-child
      a
        border-left 1px solid $light-text-color

@media screen and (max-width: 700px)
  .hidden
    display none
  
  .mobile-menu-icon
    display block
  
  .logo-wrapper
    display inline-block
    text-align left
  
  ul
    display block
    li
      text-align left
      display block
      border-top 1px solid #444444
      padding 0.3em
      &:first-child
        a
          border-left none
  nav
    display block  
</style>