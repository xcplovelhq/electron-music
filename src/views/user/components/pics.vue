<template>
  <div class="m-pics" v-show="row && row.pics.length > 0 && !row.isShowPic">
    <div
      class="m-pic"
      :style="{ width: getWidth(v) }"
      v-for="(v, idx) in row && row.pics"
      :key="idx"
      @click="hanldeEnlarge(v, row, idx)"
    >
      <my-image
        v-if="row && row.pics.length > 1"
        :ImgUrl="v.pcSquareUrl"
        Size="100%"
        Radius="8"
      ></my-image>
      <div v-else class="m-img-wap" :style="{ height: getHeight(v) }">
        <el-image
          :class="{ 'm-img-position': getPosition(v) }"
          :src="v.originUrl"
          style="vertical-align: top;"
        ></el-image>
      </div>
      <div class="m-tips" v-if="v.height > 2000">长图</div>
    </div>
  </div>
</template>

<script>
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  props: {
    row: Object
  },

  methods: {
    hanldeEnlarge(item, row, idx) {
      this.$emit("hanldeEnlarge", item, row, idx);
    },
    getWidth(item) {
      if (this.row.pics.length > 1) {
        return "120px";
      } else {
        if (item.width < item.height) {
          return "240px";
        } else {
          return "100%";
        }
      }
    },
    getHeight(item) {
      if (this.row.pics.length > 1) {
        return "auto";
      } else {
        if (item.height > 2000 && item.width < item.height) {
          return "420px";
        } else {
          return "100%";
        }
      }
    },
    getPosition(v) {
      if (this.row.pics.length > 1) {
        return false;
      } else {
        if (v.height > 2000 && v.width < v.height) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.m-pics {
  display: flex;
  flex-wrap: wrap;
  width: 370px;
  margin-top: 10px;
  .m-pic {
    position: relative;
    width: 120px;
    margin: 0 4px 4px 0;
    border-radius: 8px;
    overflow: hidden;
    cursor: -webkit-zoom-in;
    &:nth-child(3n) {
      margin: 0 0 4px 0;
    }
  }
  .m-img-wap {
    position: relative;
    .m-img-position {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: auto;
      transform: translateY(-50%);
    }
  }
  .m-tips {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 12px;
    color: #fff;
    padding: 0px 4px;
    border: 1px solid #fff;
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
