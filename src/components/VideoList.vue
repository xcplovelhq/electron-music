<template>
  <div class="g-video-list">
    <template v-for="(item, index) in list">
      <div class="m-items" v-if="index < min" :key="item.key">
        <div class="m-img">
          <el-image class="img" :src="item.picUrl" fit="fill"></el-image>
          <div class="m-play-num">
            <i class="iconfont">&#xe607;</i>{{ getSum(item.playCount) }}
          </div>
        </div>
        <div class="m-text">
          <h3>{{ item.name }}</h3>
          <p>{{ item.artists[0].name }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Moment from "moment";
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    min: {
      type: [String, Number],
      default: 4
    }
  },
  computed: {
    getTime() {
      return Moment().format("DD");
    },
    getImg() {
      return (
        this.list[this.list.length - 1] &&
        this.list[this.list.length - 1].picUrl
      );
    }
  },
  methods: {
    getSum(num) {
      if (num > 100000) {
        return (num / 10000).toFixed(0) + "万";
      } else {
        return num;
      }
    }
  }
};
</script>

<style lang="less">
.g-video-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .m-items {
    width: 23.3%;
    margin-bottom: 40px;
    .m-img {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 8px;
      &::before {
        content: "";
        padding-top: 55%;
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
        right: 7px;
        top: 5px;
        font-size: 12px;
        color: #fff;
        .iconfont {
          font-size: 12px;
          margin-right: 3px;
        }
      }
    }

    .m-text {
      margin-top: 5px;
      h3 {
        font-size: 13px;
        color: #444;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      p {
        font-size: 13px;
        color: #c5c5c5;
      }
    }
  }
}
</style>
