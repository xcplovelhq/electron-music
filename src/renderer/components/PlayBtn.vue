<template>
  <div class="g-play-btn">
    <div class="m-play-btn"><i class="iconfont">&#xe737;</i>播放全部</div>
    <div class="m-add">
      <i class="iconfont i-add">&#xe61e;</i>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="less" scoped>
.g-play-btn {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .m-play-btn {
    position: relative;
    padding: 0px 20px 0 12px;
    height: 30px;
    line-height: 28px;
    font-size: 13px;
    color: #444;
    border-radius: 50px 0 0 50px;
    overflow: hidden;
    cursor: default;
    background: @brand-color;
    color: #fff;
    &:hover {
      background: #cb3633;
    }
    .iconfont {
      margin-right: 5px;
      vertical-align: bottom;
    }
  }
  .m-add {
    min-width: 35px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    text-align: center;
    border-radius: 0 50px 50px 0;
    border-left: 1px solid rgba(255, 255, 255, 0.3);
    background: @brand-color;
    z-index: 5;
    cursor: default;
    .iconfont {
      font-size: 25px;
      color: #fff;
    }
    &:hover {
      background: #cb3633;
    }
  }
}
</style>
