<template>
  <div class="g-mini">
    <div
      class="m-bg"
      :style="{
        background: `url(${getBG}) no-repeat`,
        backgroundSize: 'cover'
      }"
    >
      <div class="m-header">
        <div class="m-handle">
          <div>╳</div>
          <div @click="handleChangeMini">□</div>
        </div>
        <div class="m-title">
          <h3>{{ getPlayInfo.name }}</h3>
          <p>
            <span
              v-for="(v, idx) in getPlayInfo.ar || getPlayInfo.artists"
              :key="v.id"
              >{{ getSongName(v, idx) }} --
              {{
                (getPlayInfo.al && getPlayInfo.al.name) ||
                  getPlayInfo.album.name
              }}</span
            >
          </p>
        </div>
      </div>
      <div class="m-footer">
        <div
          class="m-songpic"
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
            Radius="4"
          ></my-image>

          <div class="m-warper">
            <i class="iconfont" v-if="$store.state.isShowPlayingDrawer"
              >&#xe628;</i
            >
            <i class="iconfont" v-else>&#xe621;</i>
          </div>
        </div>
        <div class="m-play-box">
          <div class="flex-justify-between">
            <div class="m-play-btn">
              <div class="m-prev" @click="handleClick('prev')">
                <i class="iconfont" :class="{ 'z-fm': getFm }">&#xe727;</i>
              </div>
              <div class="m-play" @click="handleClick('play')">
                <i class="iconfont" v-if="!playing">&#xe648;</i>
                <i class="iconfont" v-else>&#xe647;</i>
              </div>
              <div class="m-next" @click="handleClick('next')">
                <i class="iconfont">&#xe728;</i>
              </div>
            </div>

            <div class="m-play-order">
              <div class="m-collect">
                <i
                  class="iconfont active"
                  v-if="getIsLike"
                  @click="handleLike(true)"
                  >&#xeca2;</i
                >
                <i class="iconfont" v-else @click="handleLike(false)"
                  >&#xeca1;</i
                >
              </div>
              <div class="m-list" @click="handleOpen" v-if="!getFm">
                <i
                  class="iconfont"
                  :class="{ active: $store.state.isShowDrawer }"
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

          <div class="m-slider">
            <el-slider
              v-model="currentTime"
              @change="handleChange"
              @input="handleInput"
              :max="duration"
              :show-tooltip="false"
            ></el-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import MyImage from "@/components/Image";
import { getStorage } from "@/lib/store";

export default {
  components: {
    MyImage
  },
  data() {
    return {
      volume: 0,
      currentTime: 0,
      duration: 0
    };
  },
  computed: {
    getBG() {
      return (
        (this.getPlayInfo &&
          this.getPlayInfo.al &&
          this.getPlayInfo.al.picUrl) ||
        this.getPlayInfo.album.picUrl
      );
    },
    playing() {
      return this.$store.state.Play.isPlay;
    },
    getPlayInfo() {
      return this.$store.state.Play.playInfo;
    },
    getFm() {
      return this.$store.state.Play.isFM;
    },
    getIsLike() {
      return getStorage("likeMusicIds").includes(this.getPlayInfo.id);
    }
  },
  created() {
    ipcRenderer.on("getMiniInfo", (event, data) => {
      switch (data.type) {
        case "volume":
          this.volume = data.data;
          break;
        case "currentTime":
          this.currentTime = data.data;
          break;
        case "duration":
          this.duration = data.data;
          break;
        default:
          break;
      }
    });
  },
  mounted() {
    this.volume = this.$store.state.Play.volume;
  },
  methods: {
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    handleChangeMini() {
      ipcRenderer.send("changeMini");
    },
    handleChange() {},
    handleInput() {},
    handleLike() {},
    handleOpen() {},
    handleVolume(volume) {
      this.volume = volume;
      ipcRenderer.send("control", { type: "volume", data: volume });
    },
    handleClick(type) {
      ipcRenderer.send("control", { type: type });
    },
    openPlaying() {}
  }
};
</script>

<style lang="less" scoped>
.g-mini {
  width: 100%;
  height: 100%;

  .m-bg {
    position: relative;
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
    // &:hover {
    //   .m-header,
    //   .m-footer {
    //     display: block;
    //   }
    // }
    .m-header,
    .m-footer {
      display: block;
      position: absolute;
      left: 0;
      width: 100%;
      height: 50px;
      background: rgba(237, 237, 237, 0.9);
    }
    .m-header {
      display: flex;
      align-items: center;
      top: 0;
      &::before {
        filter: blur(10px);
      }
    }
    .m-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 20px;
      bottom: 0;
    }
  }
  .m-handle {
    position: absolute;
    left: 5px;
    top: 5px;
    div {
      font-size: 10px;
      color: #999;
      &:first-child {
        margin-left: 1px;
        font-size: 8px;
      }
      &:hover {
        color: #333;
      }
    }
  }
  .m-title {
    width: 100%;
    text-align: center;
    h3 {
      font-size: 12px;
    }
    p {
      font-size: 12px;
      color: #939393;
    }
  }
  .m-songpic {
    position: relative;
    width: 33px;
    height: 33px;
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
  .m-play-box {
    margin-left: 10px;
    flex: 1;
    .m-play-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-right: 195px;
      .m-play {
        margin: 0 25px;
        .iconfont {
          font-size: 28px;
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
        margin-left: 10px;
        .z-fm {
          color: #f5c5c3;
        }
      }
      .m-next {
        margin-right: 10px;
      }
    }
    .m-play-order {
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
      .m-collect {
        margin-left: 0;
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
}
</style>

<style lang="less">
.g-mini {
  .m-play-box {
    .m-slider {
      width: 100%;
      .el-slider__runway {
        margin: 4px 0;
        height: 2px;
        cursor: default;
        background: #bababa;
      }
      .el-slider__bar {
        background: @brand-color;
        height: 2px;
      }
      .el-slider__button-wrapper {
        top: -18px;
        cursor: default;
      }
      .el-slider__button {
        width: 11px;
        height: 11px;
        background: @brand-color;
        border: 0;
        cursor: default;
      }
    }
  }
}
</style>
