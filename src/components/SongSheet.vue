<template>
  <div class="g-song-sheet-list">
    <div class="m-items" v-if="type === 'recommend'">
      <div class="m-song-img m-filter" @click="handleClick(item, 'recommend')">
        <my-image :ImgUrl="getImg" Size="100%" Radius="8"></my-image>
        <!-- <img class="img" :src="getImg" /> -->
        <div class="m-time">
          <div class="m-time-text">{{ getTime }}</div>
          <i class="iconfont">&#xe7c5;</i>
        </div>
      </div>
      <div class="m-text" @click="handleClick(item, 'recommend')">
        每日歌曲推荐
      </div>
    </div>
    <template v-for="(item, index) in list">
      <div
        class="m-items"
        v-if="getIndex(index) && index >= max"
        :key="item.key"
      >
        <div class="m-song-img" @click="handleClick(item)">
          <my-image
            :ImgUrl="item.picUrl || item.coverImgUrl"
            Size="100%"
            Radius="8"
          ></my-image>
          <!-- <el-image
            class="img"
            :src="item.picUrl || item.coverImgUrl"
            fit="fill"
          ></el-image> -->
          <div class="m-play-num">
            <i class="iconfont">&#xe607;</i>{{ getSum(item.playCount) }}
          </div>
        </div>
        <div class="m-text" @click="handleClick(item)">{{ item.name }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import Moment from "moment";
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: ""
    },
    min: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: 0
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
    },
    getIndex(index) {
      if (this.type === "recommend") {
        if (index < 9) {
          return true;
        }
      } else {
        console.log(this.min && index < this.min);

        if (this.min) {
          if (index < this.min) {
            return true;
          }
        } else {
          return true;
        }
      }
    },
    handleClick(row, type) {
      if (type === "recommend") {
        this.$router.push({ name: "recommendMusic" });
      } else {
        this.$router.push({ name: "songSheetDetails", query: { id: row.id } });
      }
    }
  }
};
</script>

<style lang="less">
.g-song-sheet-list {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  // &::after {
  //   content: "";
  //   flex: auto; /* 或者flex: 1 */
  // }
  .m-items {
    width: 18%;
    margin-bottom: 40px;
    &:not(:nth-child(5n)) {
      margin-right: calc(10% / 4);
    }
    .m-song-img {
      width: 100%;
      position: relative;

      overflow: hidden;
      border-radius: 8px;
      // cursor: pointer;
      // &::before {
      //   content: "";
      //   padding-top: 100%;
      //   display: block;
      // }
      // .img {
      //   position: absolute;
      //   left: 0;
      //   top: 0;
      //   height: 100%;
      //   width: 100%;
      //   z-index: 99;
      // }
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
        img {
          filter: blur(5px);
        }
      }
      .m-time {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        .iconfont {
          font-size: 8vw;
          color: #fff;
        }
        .m-time-text {
          position: absolute;
          left: 50%;
          top: 67%;
          transform: translate(-50%, -50%);
          font-size: 3vw;
          color: #fff;
        }
      }
    }

    .m-text {
      margin-top: 5px;
      font-size: 13px;
      color: #555;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
  }
}
</style>
