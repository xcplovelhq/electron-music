<template>
  <div class="g-footer-play">
    <div class="m-slider">
      <el-slider
        :value="slider"
        @change="handleChange"
        @input="handleInput"
        :max="getDuration"
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
          <div class="m-song-time">
            {{ $moment(slider * 1000).format("mm:ss") }}/{{
              $moment(getDuration * 1000).format("mm:ss")
            }}
          </div>
        </div>
      </template>
    </div>
    <div class="m-play-btn">
      <div class="m-collect">
        <i class="iconfont active" v-if="getIsLike" @click="handleLike(true)"
          >&#xeca2;</i
        >
        <i class="iconfont" v-else @click="handleLike(false)">&#xeca1;</i>
      </div>
      <div class="m-prev" @click="handleClick('PREV')">
        <i class="iconfont" :class="{ 'z-fm': getFm }">&#xe640;</i>
      </div>
      <div class="m-play" @click="handleClick('PLAY')">
        <i class="iconfont" v-if="!playing">&#xe648;</i>
        <i class="iconfont" v-else>&#xe647;</i>
      </div>
      <div class="m-next" @click="handleClick('NEXT')">
        <i class="iconfont">&#xe63f;</i>
      </div>
      <div class="m-share"><i class="iconfont">&#xe60c;</i></div>
    </div>
    <div class="m-play-order">
      <Loop v-if="!getFm"></Loop>
      <div class="m-list" @click="openList" v-if="!getFm">
        <i class="iconfont" :class="{ active: $store.state.isShowDrawer }"
          >&#xe634;</i
        >
      </div>
      <div class="m-word" @click="handleLyric">
        <i class="iconfont" :class="{ active: $store.state.Play.isShowLyric }"
          >&#xe671;</i
        >
      </div>
      <el-popover
        ref="popover"
        placement="top"
        width="30"
        trigger="hover"
        content=""
      >
        <el-slider
          :value="volume"
          :min="0"
          :max="1"
          :step="0.01"
          vertical
          height="80px"
          :show-tooltip="false"
          @input="handleVolume"
        ></el-slider>
      </el-popover>
      <div class="m-volume" v-popover:popover>
        <i class="iconfont">&#xe87a;</i>
      </div>
    </div>
  </div>
</template>

<script>
import { getStorage } from "@/lib/store";
import { ipcRenderer } from "electron";
import { shuffle } from "@/lib/utils";
import { mapActions } from "vuex";
import MyImage from "@/components/Image";
import Loop from "@/components/Loop";
// import { throttle } from "@/lib/utils";
export default {
  components: {
    MyImage,
    Loop
  },
  data() {
    return {
      time: "",
      slider: 0,
      volume: 0,
      playTime: 0,
      currentTime: 0,
      duration: 0,
      audio: null,
      isPlay: false,
      randomMusic: []
    };
  },
  created() {
    ipcRenderer.on("control", (event, data) => {
      console.log(data);

      switch (data.type) {
        case "play":
          this.handleClick("PLAY");
          break;
        case "next":
          this.handleClick("NEXT");
          break;
        case "prev":
          this.handleClick("PREV");
          break;
        case "volume":
          this.$store.commit("SET_VOLUME", data.data);
          break;
        default:
          break;
      }
    });
    this.getSongUrlData();
  },
  mounted() {
    // let self = this;
    this.volume = this.$store.state.Play.volume;

    this.randomMusic = shuffle(this.$store.state.Play.playList);
    // this.audio.load();

    // this.audio.ontimeupdate = function() {
    //   self.getTimeupdate();
    // };
  },
  computed: {
    ...mapActions(["getSongUrl"]),

    getCurrentTime() {
      return this.$store.state.Play.currentTime || 0;
    },
    getSlider() {
      return this.$store.state.Play.slider || 0;
    },
    getDuration() {
      return this.$store.state.Play.duration || 0;
    },
    getPlayInfo() {
      return this.$store.state.Play.playInfo;
    },
    getLoopValue() {
      return this.$store.state.Play.loop;
    },
    getIsEnd() {
      return this.$store.state.Play.isEnd;
    },

    getMusicUrl() {
      let url = "";
      let playUrls = this.$store.state.Play.playUrls;
      playUrls.forEach(item => {
        if (item.id === this.getPlayInfo.id) {
          url = item.url;
        }
      });
      return url;
    },
    playing() {
      if (this.$store.state.Play.isPlay) {
        this.audio && this.audio.play();
      } else {
        this.audio && this.audio.pause();
      }
      return this.$store.state.Play.isPlay;
    },

    getFm() {
      return this.$store.state.Play.isFM;
    }
  },
  methods: {
    openPlaying() {
      if (!this.getFm) {
        this.$store.commit(
          "CHANGE_PLAYING_DRAWER_STATUS",
          !this.$store.state.isShowPlayingDrawer
        );
      }
    },
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    handleLike() {},
    getIsLike() {
      return getStorage("likeMusicIds").includes(this.getPlayInfo.id);
    },
    openList() {
      this.$store.commit("SET_DRAWER_TYPE", "playList");
      this.$store.commit(
        "CHANGE_DRAWER_STATUS",
        !this.$store.state.isShowDrawer
      );
    },
    handleVolume(volume) {
      this.$store.commit("SET_VOLUME", volume);
      ipcRenderer.send("setMiniInfo", { type: "volume", data: volume });
    },
    handleChange(row) {
      this.$store.commit("SET_SLIDER", row);
    },
    handleInput(row) {
      this.slider = row;
    },
    handleLyric() {
      if (this.$store.state.Play.isShowLyric) {
        ipcRenderer.send("setLyric", false);
      } else {
        ipcRenderer.send("setLyric", true);
      }
      this.$store.commit(
        "SET_ISSHOWLYRIC",
        !this.$store.state.Play.isShowLyric
      );
    },
    getPLayList(type) {
      let tracks = this.$store.state.Play.playList;
      let row = this.$store.state.Play.playInfo;
      let nextRow = {};

      if (this.getLoopValue === "random") {
        tracks = this.randomMusic;
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
    handleClick(type) {
      switch (type) {
        case "PLAY":
          this.$store.commit("SET_ISPLAY", !this.$store.state.Play.isPlay);
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
      ipcRenderer.send("getControl", {
        type: type,
        data: !this.$store.state.Play.isPlay
      });
    },
    getSongUrlData() {
      if (this.$store.state.Play.playDetails) {
        this.$store.dispatch("getSongUrl", {
          id: this.$store.state.Play.playDetails.tracks.map(item => item.id)
        });
      }
    }
  },
  watch: {
    getVolume(data) {
      this.audio.volume = data;
    },
    getSlider(data) {
      this.slider = data;
    },
    getCurrentTime(data) {
      this.slider = data;
    },
    getIsEnd() {
      this.getPLayList("NEXT");
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
    .m-word {
      .iconfont {
        font-size: 16px;
      }
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
