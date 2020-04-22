<template>
  <div class="g-mv-list" v-infinite-scroll="load">
    <div class="m-items" v-for="item in list" :key="item.key">
      <div class="m-img" @click="handleClick(item)">
        <el-image class="img" :src="item.imgurl" fit="fill"></el-image>
        <div class="m-play-num">
          <i class="iconfont">&#xe607;</i>{{ getSumData(item.playCount) }}
        </div>
        <div class="m-time">{{ $moment(item.duration).format("mm:ss") }}</div>
      </div>
      <div class="m-text" @click="handleClick(item)">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { getSum } from "@/lib/utils";
export default {
  data() {
    return {
      isLoading: false,
      limit: 10,
      list: []
    };
  },
  created() {
    this.getArtistMv();
  },
  methods: {
    getSumData(time) {
      return getSum(time);
    },
    handleClick(row, type) {
      if (type === "recommend") {
        this.$router.push({ name: "recommendMusic" });
      } else {
        this.$router.push({ name: "songSheetDetails", query: { id: row.id } });
      }
    },
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getArtistMv();
    },
    getArtistMv() {
      this.$api.singerData
        .getArtistMv({
          id: this.$route.query.id,
          limit: this.limit
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.list = data.mvs;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-mv-list {
  display: grid;
  // flex-wrap: wrap;
  justify-content: space-between;
  grid-row-gap: 10px;
  grid-template-columns: repeat(auto-fill, 19%);
  .m-items {
    // min-width: 230px;
    margin-bottom: 40px;
    .m-img {
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
