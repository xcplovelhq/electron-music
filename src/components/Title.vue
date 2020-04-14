<template>
  <div class="g-title">
    <router-link to="">{{ title }}<i class="iconfont">&#xe72b;</i></router-link>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
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
      font-weight: bold;
    }
  }
  .iconfont {
    margin-left: 5px;
  }
}
</style>
