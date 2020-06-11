<template>
  <div class="g-comment-order">
    <div class="i-zan" @click="handleZan">
      <i class="iconfont" :class="{ active: item.info.liked }">&#xe611;</i
      >{{ item.info.likedCount }}
    </div>
    <div><i class="iconfont">&#xe60c;</i>{{ item.info.shareCount }}</div>
    <div @click="handleComment">
      <i class="iconfont">&#xe620;</i>{{ item.info.commentCount }}
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.g-comment-order {
  display: flex;
  font-size: 12px;
  color: #939393;
  .i-zan {
    .iconfont {
      margin-right: 5px;
    }
  }
  div {
    padding: 0 10px;
    border-right: 1px solid #f4f4f4;
    &:last-child {
      border-right: 0;
    }
  }
  .iconfont {
    font-size: 12px;
    color: #7d7c7d;
  }
}
</style>
