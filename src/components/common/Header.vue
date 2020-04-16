<template>
  <div class="g-header">
    <div class="m-left-right">
      <div class="m-left active" @click="handleRouter('back')">
        <i class="iconfont">&#xe72a;</i>
      </div>
      <div class="m-right" @click="handleRouter('next')">
        <i class="iconfont">&#xe72b;</i>
      </div>
    </div>
    <div class="m-main">
      <div class="m-nav">
        <router-link :to="{ path: '/find' }" class="m-nav-item"
          >个性推荐</router-link
        >
        <router-link :to="{ name: 'songSheet' }" class="m-nav-item"
          >歌单</router-link
        >
        <!-- <router-link to="" class="m-nav-item">主播电台</router-link> -->
        <router-link :to="{ name: 'rankingList' }" class="m-nav-item"
          >排行榜</router-link
        >
        <router-link :to="{ name: 'singer' }" class="m-nav-item"
          >歌手</router-link
        >
        <router-link :to="{ name: 'newMusic' }" class="m-nav-item"
          >最新音乐</router-link
        >
      </div>
      <div
        class="flex-justify-end"
        :class="{ 'z-playing': getDrawerType == 'playing' && isShowDrawer }"
      >
        <g-search></g-search>
        <div class="m-menu">
          <div class="m-setting"><i class="iconfont">&#xe61f;</i></div>
          <el-badge :value="getMessageIdx" class="item">
            <div class="m-message" @click="handleMessage">
              <i class="iconfont">&#xe60d;</i>
            </div>
          </el-badge>
          <div class="m-theme"><i class="iconfont">&#xe653;</i></div>
          <div class="m-abridge"><i class="iconfont">&#xea6b;</i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GSearch from "@/components/common/Search";
export default {
  components: {
    GSearch
  },

  computed: {
    getMessageIdx () {
      return this.$store.state.User.messageIndex;
    },
    getDrawerType () {
      return this.$store.state.drawerType;
    },
    isShowDrawer () {
      return this.$store.state.isShowDrawer;
    }
  },
  created () {
    this.getMsgProvate();
  },
  methods: {
    handleRouter (type) {
      if (type === "back") {
        this.$router.back();
      }
    },
    handleMessage () {
      this.$store.commit("SET_DRAWER_TYPE", "message");
      this.$store.commit(
        "CHANGE_DRAWER_STATUS",
        !this.$store.state.isShowDrawer
      );
    },
    getMsgProvate () {
      this.$store.dispatch("getMsgProvate");
    }
  }
};
</script>

<style lang="less">
.g-header {
  width: 100%;
  height: 50px;
  display: flex;
  -webkit-app-region: drag;
  .m-left-right {
    width: 200px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: @main-background;
    div {
      width: 22px;
      height: 22px;
      .routine-text-color;
      text-align: center;
      line-height: 22px;
      i {
        font-size: 14px;
      }

      &:hover {
        border-radius: 50%;
        background: #ebebeb;
      }
      &.active {
        color: #d9d9d9;
        &:hover {
          border-radius: 50%;
          background: #f7f7f7;
        }
      }
    }
    .m-left {
      margin-right: 10px;
    }
  }
  .m-main {
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 16px;
    background: @routine-background;
    .m-nav {
      display: flex;
      margin-right: 40px;
      .m-nav-item {
        font-size: 14px;
        margin-right: 29px;
        .routine-text-color;
        &:last-child {
          margin-right: 0;
        }
        &.active {
          .main-text-color;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
    .flex-justify-end {
      position: absolute;
      right: 20px;
      top: 14px;
      z-index: 10000;
      &.z-playing {
        .iconfont {
          color: #4b4b4b !important;
        }
        .g-search {
          background: rgba(0, 0, 0, 0.1);
        }
        .el-input__inner {
          color: #4b4b4b;
        }
        .el-input__clear,
        .el-input__prefix,
        .el-input__suffix {
          color: #4b4b4b !important;
        }
        input::-webkit-input-placeholder {
          color: #4b4b4b;
        }
      }
    }
    .m-menu {
      display: flex;
      justify-content: space-between;
      .m-setting,
      .m-message,
      .m-theme,
      .m-abridge {
        position: relative;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        margin-left: 15px;
        .iconfont {
          font-size: 16px;
          color: #fff;
          opacity: 0.6;
        }
        &:hover {
          border-radius: 50%;
          background: #d34947;
        }
      }
    }
  }
  .router-link-exact-active {
    opacity: 1 !important;
  }
}
</style>
