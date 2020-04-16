<template>
  <div style="width: 100%; height: 100%">
    <g-header></g-header>
    <div class="g-main">
      <g-nav></g-nav>
      <div class="m-main">
        <transition>
          <keep-alive>
            <router-view :key="key"></router-view>
          </keep-alive>
        </transition>
        <el-drawer
          :visible="isShowDrawer"
          :class="{ 'el-drawer__wrapper_playing': getDrawerType == 'playing' }"
          @open="handleOpen"
          @close="handleClose"
          :withHeader="false"
          :modal="false"
          :size="getDrawerType != 'playing' ? '420px' : '100%'"
          :direction="getDrawerType != 'playing' ? 'rtl' : 'btt'"
        >
          <play-list v-if="getDrawerType === 'playList'"></play-list>
          <message v-else-if="getDrawerType === 'message'"></message>
          <playing v-else-if="getDrawerType === 'playing'"></playing>
        </el-drawer>
      </div>
    </div>
    <g-footer-play></g-footer-play>
  </div>
</template>

<script>
import GHeader from "@/components/common/Header";
import GNav from "@/components/common/Nav";
import GFooterPlay from "@/components/common/FooterPlay";
import PlayList from "@/views/drawer/drawer-play-list";
import Message from "@/views/drawer/message";
import Playing from "@/views/drawer/playing";

import { getStorage } from "@/lib/store";

export default {
  name: "home",
  components: { GHeader, GNav, GFooterPlay, PlayList, Message, Playing },
  data () {
    return {};
  },
  created () {
    console.log(getStorage());
    // deleteStorage("playList");
  },
  computed: {
    key () {
      return this.$route.name
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
    isShowDrawer () {
      return this.$store.state.isShowDrawer;
    },
    getDrawerType () {
      return this.$store.state.drawerType;
    }
  },
  methods: {
    handleOpen () {
      this.$store.commit("CHANGE_DRAWER_STATUS", true);
    },
    handleClose () {
      this.$store.commit("CHANGE_DRAWER_STATUS", false);
    }
  }
};
</script>

<style lang="less">
.g-main {
  display: flex;
  height: calc(100% - 110px);
  .m-main {
    position: relative;
    height: 100%;
    flex: 1;
    overflow-y: auto;
  }
  .el-drawer__wrapper {
    top: 50px;
    bottom: 60px;
    &.el-drawer__wrapper_playing {
      top: 0;
      .el-drawer {
        background: #f8f7f8;
      }
    }
    .el-drawer:focus {
      border: 0;
    }
    .el-drawer__body {
      height: 100%;
    }
  }
}
</style>
