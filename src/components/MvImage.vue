<template>
  <div class="g-mv-image" ref="mvImage">
    <el-image
      class="img"
      :src="
        (mv.cover || mv.coverUrl || mv.picUrl || mv.data.coverUrl) +
          `?param=${width}y${height}`
      "
      fit="cover"
      @click="handleClick"
    >
      <div class="m-error" slot="placeholder">
        <i slot="placeholder" class="iconfont">&#xe635;</i>
      </div>
      <div class="m-error" slot="error">
        <i slot="placeholder" class="iconfont">&#xe635;</i>
      </div></el-image
    >
    <div class="m-play-num">
      <i class="iconfont">&#xe607;</i
      >{{ getSumData(mv.playCount || (mv.data && mv.data.praisedCount)) }}
    </div>
    <div class="m-time" v-if="mv.data">
      {{ $moment(mv.data.durationms).format("mm:ss") }}
    </div>
  </div>
</template>

<script>
import { getSum } from "@/lib/utils";

export default {
  props: {
    mv: Object,
    type: String
  },
  data() {
    return {
      width: 150,
      height: 100
    };
  },
  mounted() {
    this.width = this.$refs.mvImage.clientWidth;
    this.height = this.$refs.mvImage.clientHeight;
  },
  methods: {
    getSumData(time) {
      return getSum(time);
    },
    handleClick() {
      let id = 0;
      if (this.type === "video") {
        id = this.mv.vid || this.mv.data.vid;
      } else {
        id = this.mv.id;
      }
      this.$router.push({
        name: "mvDetails",
        query: { id: id, type: this.type }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.g-mv-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  &::before {
    content: "";
    padding-top: 60%;
    display: block;
  }
  .img {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
  }
  .m-play-num {
    position: absolute;
    right: 0px;
    top: 0px;
    padding-top: 5px;
    padding-right: 7px;
    width: 100%;
    font-size: 12px;
    color: #fff;
    text-align: right;
    z-index: 100;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(129, 118, 118, 0));
    .iconfont {
      font-size: 12px;
      margin-right: 3px;
    }
  }
  &.m-filter {
    .img {
      filter: blur(5px);
    }
  }
  .m-time {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 100;
    font-size: 12px;
    color: #fff;
  }
}
</style>
<style lang="less">
.g-mv-image {
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
