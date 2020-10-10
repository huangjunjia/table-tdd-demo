<template>
  <a-page-header
    class="nav-bar"
    :title="title"
    :sub-title="subTitle"
    @back="goback"
  >
    <template v-slot:extra>
      <slot/>
    </template>
  </a-page-header>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    title: String,
    subTitle: String,
    backPath: String
  },
  methods: {
    goback () {
      if (this.backPath) {
        this.$router.push(this.backPath)
      } else {
        this.$router.back()
      }
    }
  }
}
</script>

<style scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 65px;
  background: #ffffff;
  box-shadow: 0 0 3px 2px #efefef;
}
</style>
