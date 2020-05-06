<template>
  <div
    class="g-image"
    :class="{ 'z-hover': isHover }"
    ref="myImage"
    :style="{
      width: Size,
      height: Size,
      'min-width': MinWidth,
      'border-radius': Radius + 'px'
    }"
  >
    <div class="m-img">
      <el-image :src="getImgUrl" fit="fill" style="width: 100%; height: 100%">
        <div class="m-error" slot="placeholder">
          <i slot="placeholder" class="iconfont">&#xe635;</i>
        </div>
        <div class="m-error" slot="error">
          <i slot="placeholder" class="iconfont">&#xe635;</i>
        </div>
      </el-image>
      <!-- <img :src="ImgUrl" alt="" /> -->
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
  },
  data() {
    return {
      getImgUrl: require("@/assets/default.png")
    };
  },

  mounted() {
    setTimeout(() => {
      let width = this.$refs.myImage.clientWidth * 2 || 200;
      this.getImgUrl = this.ImgUrl
        ? this.ImgUrl + `?param=${width}y${width}`
        : require("@/assets/default.png");
    }, 0);
  },
  watch: {
    ImgUrl() {
      let width = this.$refs.myImage.clientWidth || 200;
      this.getImgUrl = this.ImgUrl
        ? this.ImgUrl + `?param=${width}y${width}`
        : require("@/assets/default.png");
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
    cursor: pointer;
    transition: all 0.3s linear;
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
    width: 100%;
    border: 0;
  }
}
</style>

<style lang="less">
.g-image {
  .m-error {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #e0e0e0;
    .iconfont {
      font-size: 4em;
      color: #fff;
    }
  }
}
</style>
