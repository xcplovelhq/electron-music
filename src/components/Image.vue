<template>
  <div
    class="g-image"
    :class="{ 'z-hover': isHover }"
    :style="{
      width: Size,
      height: Size,
      'min-width': MinWidth,
      'border-radius': Radius + 'px'
    }"
  >
    <div class="m-img">
      <img :src="ImgUrl" alt="" />
      <div
        class="m-play-btn"
        :style="{
          width: IconSize,
          height: IconSize
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ImgUrl: String,
    Size: String || Number,
    Radius: String || Number,
    MinWidth: String || Number,
    IconSize: String || Number,
    isHover: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.g-image {
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  &:before {
    content: "";
    padding-top: 100%;
    display: block;
  }
  &.z-hover {
    .m-play-btn {
      display: none;
    }
    &:hover {
      .m-play-btn {
        display: block;
      }
    }
  }
  .m-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .m-play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("../assets/play.png");
    background-size: cover;
  }
  img {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    height: 100%;
    border: 0;
  }
}
</style>
