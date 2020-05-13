<template>
  <div class="g-footer-play">
    <div class="m-slider">
      <el-slider
        v-model="currentTime"
        @change="handleChange"
        @input="handleInput"
        :max="duration"
        :show-tooltip="false"
      ></el-slider>
    </div>
    <div class="m-song-box">
      <template v-if="getPlayInfo && getPlayInfo.id">
        <div
          class="m-avata"
          :class="{
            active: $store.state.isShowPlayingDrawer
          }"
          @click="openPlaying"
        >
          <my-image
            :ImgUrl="
              (getPlayInfo && getPlayInfo.al && getPlayInfo.al.picUrl) ||
                getPlayInfo.album.picUrl
            "
            Size="100%"
            Radius="8"
          ></my-image>

          <div class="m-warper">
            <i class="iconfont" v-if="$store.state.isShowPlayingDrawer"
              >&#xe628;</i
            >
            <i class="iconfont" v-else>&#xe621;</i>
          </div>
        </div>
        <div class="m-song-info">
          <div class="flex-justify-start">
            <div class="m-info">
              {{ getPlayInfo.name }}
              <span v-if="getPlayInfo.alia && getPlayInfo.alia[0]"
                >({{ getPlayInfo.alia[0] }})</span
              >
            </div>
            <div class="m-name">
              -
              <router-link
                :to="{
                  name: 'singerDetails',
                  query: { id: v.id }
                }"
                v-for="(v, idx) in getPlayInfo.ar || getPlayInfo.artists"
                :key="v.id"
                >{{ getSongName(v, idx) }}</router-link
              >
            </div>
          </div>
          <div class="m-song-time">{{ getCurrentTime }}/{{ time }}</div>
        </div>
      </template>
    </div>
    <div class="m-audio">
      <audio
        ref="audio"
        :src="getMusicUrl"
        :autoplay="playing"
        @durationchange="getDuration"
        @timeupdate="getTimeupdate"
        @ended="getEnded"
        preload="auto"
      ></audio>
    </div>
    <div class="m-play-btn">
      <div class="m-collect">
        <i class="iconfont active" v-if="getIsLike" @click="handleLike(true)"
          >&#xeca2;</i
        >
        <i class="iconfont" v-else @click="handleLike(false)">&#xeca1;</i>
      </div>
      <div class="m-prev" @click="handleClick('PREV')">
        <i class="iconfont" :class="{ 'z-fm': getFm }">&#xe727;</i>
      </div>
      <div class="m-play" @click="handleClick('PLAY')">
        <i class="iconfont" v-if="!playing">&#xe648;</i>
        <i class="iconfont" v-else>&#xe647;</i>
      </div>
      <div class="m-next" @click="handleClick('NEXT')">
        <i class="iconfont">&#xe728;</i>
      </div>
      <div class="m-share"><i class="iconfont">&#xe60c;</i></div>
    </div>
    <div class="m-play-order">
      <div class="m-loop" @click="handleLook" v-if="!getFm">
        <el-tooltip
          class="item"
          effect="dark"
          :content="loopList[loopId].name"
          placement="top"
        >
          <i title="1" class="iconfont" v-html="loopList[loopId].icon"></i>
        </el-tooltip>
      </div>
      <div class="m-list" @click="openList" v-if="!getFm">
        <i class="iconfont" :class="{ active: $store.state.isShowDrawer }"
          >&#xe634;</i
        >
      </div>
      <div class="m-word"><i class="iconfont">&#xe671;</i></div>
      <el-popover
        ref="popover"
        placement="top"
        width="30"
        trigger="hover"
        content=""
      >
        <el-slider
          v-model="volume"
          :min="0"
          :max="1"
          :step="0.01"
          vertical
          height="80px"
          :show-tooltip="false"
          @input="handleVolume"
        ></el-slider>
      </el-popover>
      <div class="m-volume" v-popover:popover @click="a = !a">
        <i class="iconfont">&#xe87a;</i>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getStorage } from "@/lib/store";
import { ipcRenderer } from "electron";
import { shuffle } from "@/lib/utils";
import { mapActions } from "vuex";
import MyImage from "@/components/Image";

// import { throttle } from "@/lib/utils";
export default {
  components: {
    MyImage
  },
  data () {
    return {
      time: "",
      volume: 0,
      playTime: 0,
      currentTime: 0,
      duration: 0,
      audio: null,
      isPlay: false,
      loopId: 0,
      loopValue: "order",
      randomMusic: [],
      loopList: [
        {
          index: "order",
          name: "顺序播放",
          icon: "&#xe608;"
        },
        {
          index: "list",
          name: "列表循环",
          icon: "&#xe66c;"
        },
        {
          index: "single",
          name: "单曲循环",
          icon: "&#xe66d;"
        },
        {
          index: "random",
          name: "随机播放",
          icon: "&#xe66b;"
        }
      ]
    };
  },
  created () {
    ipcRenderer.on("control", (event, data) => {
      switch (data) {
        case "play":
          this.handleClick("PLAY");
          break;
        case "next":
          this.handleClick("NEXT");
          break;
        case "prev":
          this.handleClick("PREV");
          break;
        default:
          break;
      }
      // ipcRenderer.send("control", "play");
    });
    this.getSongUrlData();
  },
  mounted () {
    // let self = this;
    this.audio = this.$refs.audio;
    this.volume = this.$store.state.Play.volume;
    this.loopValue = this.$store.state.Play.loop;
    this.loopList.forEach((item, idx) => {
      if (item.index === this.$store.state.Play.loop) {
        this.loopId = idx;
      }
    });
    this.randomMusic = shuffle(this.$store.state.Play.playDetails.tracks);
    // this.audio.load();

    // this.audio.ontimeupdate = function() {
    //   self.getTimeupdate();
    // };
  },
  computed: {
    ...mapActions(["getSongUrl"]),

    getCurrentTime () {
      return moment(this.currentTime * 1000).format("mm:ss");
    },
    getPlayInfo () {
      return this.$store.state.Play.playInfo;
    },

    getMusicUrl () {
      let url = "";
      let playUrls = this.$store.state.Play.playUrls;
      playUrls.forEach(item => {
        if (item.id === this.getPlayInfo.id) {
          url = item.url;
        }
      });
      return url;
    },
    playing () {
      if (this.$store.state.Play.isPlay) {
        this.audio && this.audio.play();
      } else {
        this.audio && this.audio.pause();
      }
      return this.$store.state.Play.isPlay;
    },

    getFm () {
      return this.$store.state.Play.isFM;
    }
  },
  methods: {
    openPlaying () {
      if (!this.getFm) {
        this.$store.commit(
          "CHANGE_PLAYING_DRAWER_STATUS",
          !this.$store.state.isShowPlayingDrawer
        );
      }
    },
    getSongName (item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    handleLike () { },
    getIsLike () {
      return getStorage("likeMusicIds").includes(this.getPlayInfo.id);
    },
    openList () {
      this.$store.commit("SET_DRAWER_TYPE", "playList");
      this.$store.commit(
        "CHANGE_DRAWER_STATUS",
        !this.$store.state.isShowDrawer
      );
    },
    handleLook () {
      this.loopId++;
      if (this.loopId > 3) {
        this.loopId = 0;
      }
      this.loopValue = this.loopList[this.loopId].index;
      this.$store.commit("SET_LOOP", this.loopValue);
    },
    handleVolume () {
      this.audio.volume = this.volume;
      this.$store.commit("SET_VOLUME", this.volume);
    },
    getDuration (e) {
      this.duration = Math.floor(e.target.duration);
      this.time = moment(e.target.duration * 1000).format("mm:ss");
    },
    getTimeupdate (e) {
      this.currentTime = Math.floor(e.target.currentTime);
      this.$store.commit("SET_CURRENT_TIME", e.target.currentTime);
    },
    getEnded () {
      this.getPLayList("NEXT", "END");
    },
    handleChange () {
      this.audio.currentTime = this.currentTime;
    },
    handleInput () {
      // this.currentTime = row;
    },
    getPLayList (type, status) {
      let tracks = this.$store.state.Play.playList;
      let row = this.$store.state.Play.playInfo;
      let nextRow = {};

      if (this.loopValue === "random") {
        tracks = this.randomMusic;
      }
      if (status && status === "END") {
        if (this.loopValue === "single") {
          this.audio.currentTime = 0;
          this.audio.load();
          this.$store.commit("SET_ISPLAY", true);
        } else if (this.loopValue === "order") {
          if (row.id === tracks[tracks.length - 1].id) {
            this.$store.commit("SET_ISPLAY", false);
            this.$store.commit("SET_PLAY_INFO", {});
          }
        }
        return;
      }

      tracks.forEach((item, i) => {
        if (row.id === item.id) {
          if (type === "NEXT") {
            if (i >= tracks.length - 1) {
              nextRow = tracks[0];
            } else {
              nextRow = tracks[i + 1];
            }
          } else {
            if (i <= 0) {
              nextRow = tracks[tracks.length - 1];
            } else {
              nextRow = tracks[i - 1];
            }
          }
          this.$store.commit("SET_PLAY_INFO", nextRow);
          this.$store.dispatch("getLyric", { id: nextRow.id });
          this.$store.commit("SET_ISPLAY", true);
        }
      });
    },
    handleClick (type) {
      switch (type) {
        case "PLAY":
          if (!this.$store.state.Play.isPlay) {
            this.$store.commit("SET_ISPLAY", true);
          } else {
            this.$store.commit("SET_ISPLAY", false);
          }
          break;
        case "NEXT":
          this.getPLayList("NEXT");
          this.$store.commit("SET_ISNEXT", !this.$store.state.Play.isNext);
          break;
        case "PREV":
          if (!this.getFm) {
            this.getPLayList("PREV");
          }
          break;
        default:
          break;
      }
    },
    getSongUrlData () {
      if (this.$store.state.Play.playDetails) {
        this.$store.dispatch("getSongUrl", {
          id: this.$store.state.Play.playDetails.tracks.map(item => item.id)
        });
      }
    }
  }
};
</script>

<style lang="less">
.g-footer-play {
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 0 10px;
  border-top: 2px solid #f5f5f5;
  background: #fff;
  z-index: 10000;
  .m-slider {
    position: absolute;
    left: 0;
    top: -2px;
    width: 100%;
    z-index: 10000;
    .el-slider {
      &:hover {
        .el-slider__button {
          display: inline-block;
        }
      }
    }
    .el-slider__runway {
      margin: 0;
      height: 2px;
      cursor: default;
    }
    .el-slider__bar {
      background: @brand-color;
      height: 2px;
    }
    .el-slider__button-wrapper {
      top: -17px;
      cursor: default;
    }
    .el-slider__button {
      display: none;
      width: 11px;
      height: 11px;
      background: @brand-color;
      border: 0;
      cursor: default;
    }
  }
  .m-audio {
    position: absolute;
    left: 0;
    top: 0;
  }
  .m-song-box {
    display: flex;
    flex: 1;
    // min-width: 280px;
    // max-width: 430px;
    margin-right: 90px;
    .m-avata {
      position: relative;
      min-width: 39px;
      width: 39px;
      height: 39px;
      border-radius: 4px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.5);
      &.active,
      &:hover {
        .m-warper {
          display: block;
        }
        img {
          filter: blur(1.5px);
          opacity: 0.6;
        }
      }
      .m-warper {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        line-height: 38px;
        text-align: center;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-size: cover;
        cursor: pointer;
        .iconfont {
          font-size: 26px;
          color: #fff;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .m-song-info {
      margin-left: 10px;
      // width: 334px;

      .m-info {
        // max-width: 290px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-size: 14px;
        color: #555;
        cursor: pointer;
      }
      .m-name {
        min-width: 80px;
        color: #868686;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        a {
          font-size: 12px;
          color: #868686;
          cursor: pointer;
          &:hover {
            color: #444;
          }
        }
      }
      .m-song-time {
        font-size: 12px;
        color: #b6b6b6;
      }
    }
  }
  .m-play-btn {
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;
    // margin-right: 195px;
    .iconfont {
      cursor: pointer;
      font-size: 18px;
      color: #5e5e5e;
      &.active {
        color: @brand-color;
      }
    }
    .m-play {
      margin: 0 25px;
      .iconfont {
        font-size: 40px;
        color: @brand-color;
      }
    }
    .m-prev,
    .m-next {
      .iconfont {
        font-size: 16px;
        color: @brand-color;
      }
    }
    .m-prev {
      margin-left: 37px;
      .z-fm {
        color: #f5c5c3;
      }
    }
    .m-next {
      margin-right: 37px;
    }
  }
  .m-play-order {
    flex: 1;

    display: flex;
    justify-content: flex-end;
    div {
      margin-left: 20px;
    }
    .iconfont {
      cursor: pointer;
      font-size: 18px;
      color: #5e5e5e;
      &.active {
        color: @brand-color;
      }
    }
  }
}
.el-popover {
  min-width: auto !important;
  .el-slider.is-vertical .el-slider__runway {
    margin: 0;
  }
  .el-slider.is-vertical .el-slider__bar,
  .el-slider.is-vertical .el-slider__runway {
    width: 4px;
  }
  .el-slider.is-vertical .el-slider__bar {
    background: @brand-color;
  }
  .el-slider__button-wrapper {
    width: 34px;
    height: 34px;
  }
  .el-slider__button {
    width: 9px;
    height: 9px;
    border: 0;
    background: @brand-color;
  }
}
</style>
