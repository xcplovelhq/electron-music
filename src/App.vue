<template>
  <div id="app">
    <router-view></router-view>
    <my-audio></my-audio>

    <!-- <g-header></g-header>
    <div class="g-main">
      <g-nav></g-nav>
      <div class="m-main">
        <router-view :key="key"></router-view>
      </div>
    </div>
    <g-footer-play></g-footer-play> -->
  </div>
</template>

<script>
import MyAudio from "@/components/audio";

// import GHeader from "@/components/common/Header";
// import GNav from "@/components/common/Nav";
// import GFooterPlay from "@/components/common/FooterPlay";

export default {
  name: "app",
  // components: { GHeader, GNav, GFooterPlay },
  components: {
    MyAudio
  },
  computed: {
    key() {
      return this.$route.name
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    }
  }
};
</script>

<style lang="less">
// .g-main {
//   display: flex;
//   height: calc(100% - 110px);
//   .m-main {
//     height: 100%;
//     flex: 1;
//     overflow-y: auto;
//   }
// }
</style>
