<template>
  <div class="g-video">
    <div class="m-video" ref="videoContainer" :class="{ 'm-isfull': isFull }">
      <video
        :src="videoUrl"
        ref="video"
        @dblclick="handleFull"
        @durationchange="getDuration"
        @timeupdate="getTimeupdate"
        @ended="getEnded"
        @click="hanldePlay"
        playsinline=""
        webkit-playsinline=""
        preload="auto"
      ></video>
      <div class="m-play" v-if="!isPlay" @click="hanldePlay">
        <img src="../assets/play.png" />
      </div>
      <div class="m-controls">
        <div class="m-time">
          <span>{{ $moment(currentTime * 1000).format("mm:ss") }}</span>
          <span> / {{ $moment(duration * 1000).format("mm:ss") }}</span>
        </div>
        <div class="m-order">
          <el-popover
            popper-class="m-mv-pop"
            ref="popover"
            placement="top"
            :visible-arrow="false"
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
              class="m-volume-slider"
              :show-tooltip="false"
              @input="handleVolume"
            ></el-slider>
          </el-popover>
          <div class="m-volume" v-popover:popover @click="handleMute">
            <i class="iconfont">&#xe87a;</i>
          </div>
          <div class="m-full" @click="handleFull">
            <i v-if="isFull" class="iconfont">&#xe790;</i>
            <i v-else class="iconfont">&#xe638;</i>
          </div>
        </div>
      </div>
      <div class="m-slider">
        <el-slider
          v-model="currentTime"
          @change="handleChange"
          :max="duration"
          :show-tooltip="false"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: [String, Number],
    type: String
  },
  data() {
    return {
      isFull: false,
      volume: 1,
      duration: 0,
      currentTime: 0,
      isPlay: false,
      video: null,
      videoUrl: ""
    };
  },
  created() {
    if (this.type === "video") {
      this.getVideoUrl();
    } else {
      this.getMvUrl();
    }
  },
  mounted() {
    this.video = this.$refs.video;
    this.volume = this.$store.state.Play.volume;
  },
  methods: {
    getDuration(e) {
      this.duration = e.target.duration;
    },
    getTimeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    getEnded(e) {
      console.log(e);
    },
    hanldePlay() {
      setTimeout(() => {
        if (this.isPlay) {
          this.video.pause();
        } else {
          this.video.play();
        }
        this.isPlay = !this.isPlay;
      }, 300);
    },
    handleChange() {
      this.video.currentTime = this.currentTime;
    },
    handleVolume() {
      this.video.volume = this.volume;
    },
    handleMute() {
      if (this.volume) {
        this.volume = 0;
      } else {
        this.volume = 1;
      }
    },
    handleFull() {
      if (this.isFull) {
        document.webkitCancelFullScreen();
      } else {
        this.$refs.videoContainer.webkitRequestFullScreen();
      }
      this.isFull = !this.isFull;
    },
    getVideoUrl() {
      this.$api.videoData
        .getVideoUrl({
          id: this.id
        })
        .then(({ data }) => {
          this.videoUrl = data.urls[0].url;
        });
    },
    getMvUrl() {
      this.$api.videoData
        .getMvUrl({
          id: this.id
        })
        .then(({ data }) => {
          this.videoUrl = data.data.url;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-video {
  .m-video {
    position: relative;
    width: 620px;
    height: 349px;
    margin-top: 20px;
    video {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      // object-fit: cover;
      background: #000;
    }
    .m-play {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 70px;
      height: 70px;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .m-controls {
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 43px;
      z-index: 10000000;
      .m-time {
        padding-left: 12px;
        span {
          font-size: 13px;
          &:first-child {
            color: rgba(255, 255, 255, 0.6);
          }
          &:last-child {
            color: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
    &.m-isfull {
      .m-controls {
        height: 50px;
      }
    }
  }
}
</style>
<style lang="less">
.g-video {
  .m-slider {
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 100%;
    padding: 0 5px;
    .el-slider {
      &:hover {
        .el-slider__button {
          display: inline-block;
        }
      }
    }
    .el-slider__runway {
      margin: 0;
      height: 10px;
      background: transparent;
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
  .m-order {
    display: flex;
    padding: 0 15px;
    .iconfont {
      cursor: pointer;
      font-size: 18px;
      color: #fff;
    }
    .m-full {
      margin-left: 20px;
      .iconfont {
        font-size: 17px;
      }
    }
  }
  .m-isfull {
    .m-slider {
      bottom: 50px;
      .el-slider {
        height: 10px;
      }
      .el-slider__runway {
        background: #707070;
      }
      .el-slider__button {
        display: inline-block;
      }
      .el-slider__runway {
        height: 3px;
      }
      .el-slider__bar {
        height: 3px;
      }
    }
  }
}
.m-mv-pop {
  background: rgba(0, 0, 0, 0.5) !important;
  border: 0 !important;
  .m-volume-slider {
    .el-slider__runway {
      background: rgba(255, 255, 255, 0.5) !important;
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
    &[x-placement^="top"] .popper__arrow::after {
      border-top-color: rgba(0, 0, 0, 0.5) !important;
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
}
</style>
