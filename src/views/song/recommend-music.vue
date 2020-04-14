<template>
  <div class="m-recommend-song">
    <div class="m-recommend-title">
      <div class="flex-justify-start ">
        <div class="m-days">
          <div class="m-days-text">{{ getTime }}</div>
          <i class="iconfont">&#xe7c5;</i>
        </div>
        <div class="m-text">
          <h3>每日歌曲推荐</h3>
          <p>根据你的音乐口味生成，每天6:00更新</p>
        </div>
      </div>
      <div class="flex-justify-start" style="margin-top: 20px">
        <play-btn></play-btn>
        <div class="m-btn"><i class="iconfont">&#xe65e;</i>收藏全部</div>
      </div>
    </div>
    <song-box :list="songList" :isLoading="isLoading"></song-box>
  </div>
</template>

<script>
import SongBox from "./components/song-box";
import Moment from "moment";
import PlayBtn from "@/components/PlayBtn";

export default {
  components: {
    SongBox,
    PlayBtn
  },
  data() {
    return {
      isLoading: false,
      songList: []
    };
  },
  created() {
    this.getRecommendSongs();
  },
  computed: {
    getTime() {
      return Moment().format("DD");
    }
  },
  methods: {
    getRecommendSongs() {
      this.$api.musicData.getRecommendSongs().then(({ data }) => {
        this.songList = data.recommend;
      });
    }
  }
};
</script>

<style lang="less">
.m-recommend-song {
  .m-recommend-title {
    padding: 20px 30px 0;
  }
  .m-days {
    margin-right: 30px;
    position: relative;
    .iconfont {
      font-size: 8vw;
      color: #b63c35;
    }
    .m-days-text {
      position: absolute;
      left: 50%;
      top: 67%;
      transform: translate(-50%, -50%);
      font-size: 3vw;
      color: #b63c35;
    }
  }
  .m-text {
    h3 {
      margin-bottom: 5px;
      font-size: 22px;
      color: #333;
    }
    p {
      font-size: 12px;
      color: #999;
    }
  }
  .m-btn {
    position: relative;
    margin-bottom: 10px;
    margin-left: 10px;
    padding: 0px 12px;
    height: 30px;
    line-height: 28px;
    font-size: 13px;
    color: #444;
    border: 1px solid #d9d9d9;
    border-radius: 50px;
    overflow: hidden;
    cursor: default;
    &:hover {
      background: #f3f3f3;
    }
    .iconfont {
      margin-right: 5px;
      vertical-align: bottom;
    }
  }
}
</style>
