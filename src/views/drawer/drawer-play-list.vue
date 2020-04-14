<template>
  <div class="g-play-list">
    <tab-list :tabList="tabList" @getTabIndex="getTabIndex"></tab-list>
    <!-- <div class="m-tabs">
      <div class="m-tab" :class="{ active: isActive }" @click="isActive = true">
        播放列表
      </div>
      <div
        class="m-tab"
        :class="{ active: !isActive }"
        @click="isActive = false"
      >
        历史记录
      </div>
    </div> -->

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
.g-play-list {
  height: 100%;
  padding-top: 20px;
}
</style>
