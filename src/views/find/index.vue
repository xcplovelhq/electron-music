<template>
  <div class="g-find ">
    <div class="g-warper">
      <div class="g-banner">
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in bannerList" :key="item.key">
            <el-image
              class="m-banner-img"
              :src="item.imageUrl"
              fit="fill"
            ></el-image>
            <div class="m-tips">{{ item.typeTitle }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <g-title title="推荐歌单"></g-title>
      <song-sheet :list="songSheetList" type="recommend"></song-sheet>
      <g-title title="最新音乐"></g-title>
      <new-music :list="newSongList"></new-music>
      <g-title title="推荐MV"></g-title>
      <video-list :list="videoList"></video-list>
    </div>
  </div>
</template>

<script>
import GTitle from "@/components/Title";
import SongSheet from "@/components/SongSheet";
import NewMusic from "./components/new-music";
import VideoList from "@/components/VideoList";

export default {
  components: {
    GTitle,
    SongSheet,
    NewMusic,
    VideoList
  },
  data() {
    return {
      bannerList: [],
      songSheetList: [],
      newSongList: [],
      videoList: [],
      djList: []
    };
  },
  created() {
    this.getBanner();
    this.getPersonalized();
    this.getRecommendResource();
    this.getPersonalizedNewsong();
    this.getPersonalizedMv();
    this.getPersonalizedDjprogram();
  },
  methods: {
    getBanner() {
      this.$api.findData.getBanner().then(({ data }) => {
        this.bannerList = data.banners;
      });
    },
    getPersonalized() {
      this.$api.findData.getPersonalized().then(({ data }) => {
        console.log(data);

        this.songSheetList = data.result;
      });
    },
    getRecommendResource() {
      this.$api.findData.getRecommendResource().then(({ data }) => {
        console.log(data);

        // this.songSheetList = data.recommend;
      });
    },
    getPersonalizedNewsong() {
      this.$api.findData.getPersonalizedNewsong().then(({ data }) => {
        console.log(data);

        this.newSongList = data.result;
      });
    },
    getPersonalizedMv() {
      this.$api.findData.getPersonalizedMv().then(({ data }) => {
        console.log(data);

        this.videoList = data.result;
      });
    },
    getPersonalizedDjprogram() {
      this.$api.findData.getPersonalizedDjprogram().then(({ data }) => {
        console.log(data);

        this.djList = data.result;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.g-find {
  width: 100%;
  padding: 20px 30px;
  .g-banner {
    width: 100%;
    .m-banner-img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
    }
    .m-tips {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 2px 10px;
      font-size: 12px;
      color: #fff;
      border-radius: 8px 0 8px 0;
      background: #d54b4b;
    }
  }
}
</style>
