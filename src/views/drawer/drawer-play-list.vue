<template>
  <div class="g-drawer-play-list">
    <tab-list :tabList="tabList" @getTabIndex="getTabIndex"></tab-list>
    <div class="m-header">
      <div class="m-num">总{{ $store.state.Play.playList.length }}首</div>
      <div class="m-collect"><i class="iconfont">&#xe65e;</i>收藏全部</div>
      <div class="m-clear" @click="hancleClear">
        <i class="iconfont">&#xe62b;</i>清空
      </div>
    </div>
    <play-list></play-list>
  </div>
</template>

<script>
import PlayList from "./components/play-list";
import TabList from "@/components/Tabs";

export default {
  components: {
    PlayList,
    TabList
  },
  data() {
    return {
      tabList: [
        {
          isActive: true,
          name: "播放记录"
        },
        {
          isActive: false,
          name: "历史记录"
        }
      ]
    };
  },
  methods: {
    hancleClear() {
      this.$store.commit("SET_PLAY_LIST", []);
      this.$store.commit("SET_PLAY_INFO", {});
    },
    getTabIndex(name) {
      this.tabList.forEach(item => {
        item.isActive = false;
        if (item.name === name) {
          item.isActive = true;
        }
      });
    }
  }
};
</script>

<style lang="less">
.g-drawer-play-list {
  height: 100%;
  padding-top: 20px;
  .m-header {
    display: flex;
    margin: 20px 20px 0;
    padding-bottom: 10px;
    font-size: 12px;
    border-bottom: 1px solid #eeeded;
    .m-num {
      width: 196px;
      margin-right: 5px;
      color: #c7c7c7;
    }
    .m-collect {
      cursor: pointer;
      font-size: 14px;
      color: #646464;
      padding-right: 28px;
      margin-right: 20px;
      border-right: 1px solid #dcdcdc;
    }
    .m-clear {
      cursor: pointer;
      font-size: 14px;
      color: #646464;
    }
    .iconfont {
      margin-right: 5px;
    }
  }
}
</style>
