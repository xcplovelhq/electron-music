<template>
  <div class="g-title">
    <router-link :to="to" v-if="to && to.name"
      >{{ title }}<i class="iconfont">&#xe72b;</i></router-link
    >
    <span v-else>{{ title }}<i class="iconfont">&#xe72b;</i></span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    to: {
      type: Object,
      default () {
        return {};
      }
    }
  }
};
</script>

<style lang="less">
.g-title {
  margin-bottom: 14px;
  a {
    font-size: 16px;
    color: #444;
    &:hover {
      color: #000;
    }
  }
  .iconfont {
    margin-left: 5px;
  }
}
</style>
