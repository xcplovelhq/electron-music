<template>
  <div style="width: 100%; height: 100%">
    <g-header></g-header>
    <div class="g-main">
      <g-nav></g-nav>
      <div class="m-main" ref="main">
        <transition>
          <keep-alive>
            <router-view :key="key"></router-view>
          </keep-alive>
        </transition>

        <!-- <div v-if="isShowDrawer" class="aa">
          <search-box v-if="getDrawerType === 'search'"></search-box>
          <play-list v-if="getDrawerType === 'playList'"></play-list>
          <message v-else-if="getDrawerType === 'message'"></message>
          <playing></playing>
        </div> -->
        <a-drawer
          placement="right"
          :closable="false"
          @close="handleClose('base')"
          :visible="isShowDrawer"
          width="420px"
          :getContainer="() => $refs.main"
          :bodyStyle="{ padding: 0 }"
          :wrapStyle="{ top: '50px', height: 'calc(100% - 55px)' }"
          :drawerStyle="{ bottom: '60px', height: 'calc(100% - 55px)' }"
          :mask="false"
        >
          <search-box v-if="getDrawerType === 'search'"></search-box>
          <play-list v-if="getDrawerType === 'playList'"></play-list>
          <message v-else-if="getDrawerType === 'message'"></message>
        </a-drawer>

        <a-drawer
          height="100vh"
          placement="bottom"
          :closable="false"
          @close="handleClose('play')"
          :visible="isShowPlayingDrawer"
          :mask="false"
        >
          <playing></playing>
        </a-drawer>

        <!-- <el-drawer
          :visible="isShowDrawer"
          @open="handleOpen('base')"
          @close="handleClose('base')"
          :withHeader="false"
          :modal="false"
          :size="'420px'"
          :direction="'rtl'"
          :wrapperClosable="false"
        >
          <search-box v-if="getDrawerType === 'search'"></search-box>
          <play-list v-if="getDrawerType === 'playList'"></play-list>
          <message v-else-if="getDrawerType === 'message'"></message>
        </el-drawer> -->
        <!-- <el-drawer
          :visible="isShowPlayingDrawer"
          :class="'el-drawer__wrapper_playing'"
          @open="handleOpen('playing')"
          @close="handleClose('playing')"
          :withHeader="false"
          :modal="false"
          :size="'100%'"
          :direction="'btt'"
        >
          <playing></playing>
        </el-drawer> -->
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
import SearchBox from "@/views/drawer/search-box";

import { getStorage } from "@/lib/store";

export default {
  name: "home",
  components: {
    GHeader,
    GNav,
    GFooterPlay,
    PlayList,
    Message,
    Playing,
    SearchBox
  },
  data() {
    return {};
  },
  created() {
    console.log(getStorage());
    this.getData();
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
    isShowPlayingDrawer() {
      return this.$store.state.isShowPlayingDrawer;
    },
    getDrawerType() {
      return this.$store.state.drawerType;
    }
  },
  methods: {
    handleOpen(type) {
      console.log("");

      if (type === "playing") {
        this.$store.commit("CHANGE_PLAYING_DRAWER_STATUS", true);
      } else {
        this.$store.commit("CHANGE_DRAWER_STATUS", true);
      }
    },
    handleClose(type) {
      if (type === "playing") {
        this.$store.commit("CHANGE_PLAYING_DRAWER_STATUS", false);
      } else {
        this.$store.commit("CHANGE_DRAWER_STATUS", false);
      }
    },
    getData() {
      this.$api.userData.loginRefresh().then(() => {});
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
    overflow: hidden;
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
.toasted-container.top-center {
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  .toasted .primary,
  .toasted.toasted-primary {
    border-radius: 16px;

    padding: 30px;
    font-size: 20px;
  }
}
</style>
