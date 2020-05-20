<template>
  <div class="g-tabs">
    <div class="m-tabs" :style="{ width: tabList.length * 80 + 'px' }">
      <template v-for="(item, idx) in tabList">
        <el-badge v-if="item.badge" :value="item.badge" class="item" :key="idx">
          <div
            class="m-tab"
            :class="{ active: item.isActive }"
            @click="handleClick(item)"
          >
            {{ item.name }}
          </div>
        </el-badge>
        <div
          :key="idx"
          v-else
          class="m-tab"
          :class="{ active: item.isActive }"
          @click="handleClick(item)"
        >
          {{ item.name }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    handleClick(row) {
      this.$emit("getTabIndex", row.name);
    }
  }
};
</script>

<style lang="less" scoped>
.g-tabs {
  .m-tabs {
    display: flex;
    margin: 0 auto;
    border-radius: 50px;
    border: 1px solid #bbb;
    // overflow: hidden;
    .item,
    .m-tab {
      flex: 1;
      height: 28px;
      line-height: 28px;
      text-align: center;
      font-size: 12px;
      color: #444;
      border-radius: 50px;
      cursor: default;
      &:hover {
        background: #f5f5f5;
      }
      &.active,
      .m-tab.active {
        background: #bbb;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
</style>
