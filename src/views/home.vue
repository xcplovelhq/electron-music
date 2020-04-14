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
          @open="handleOpen"
          @close="handleClose"
          :withHeader="false"
          :modal="false"
          size="420px"
          direction="rtl"
        >
          <play-list v-if="getDrawerType === 'playList'"></play-list>
          <message v-else-if="getDrawerType === 'message'"></message>
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

import { getStorage } from "@/lib/store";

export default {
  name: "home",
  components: { GHeader, GNav, GFooterPlay, PlayList, Message },
  data() {
    return {};
  },
  created() {
    console.log(getStorage());
    // deleteStorage("playList");
  },
  computed: {
    key() {
      return this.$route.name
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
    isShowDrawer() {
      return this.$store.state.isShowDrawer;
    },
    getDrawerType() {
      return this.$store.state.drawerType;
    }
  },
  methods: {
    handleOpen() {
      this.$store.commit("CHANGE_DRAWER_STATUS", true);
    },
    handleClose() {
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
    .el-drawer:focus {
      border: 0;
    }
    .el-drawer__body {
      height: 100%;
    }
  }
}
</style>
