<template>
  <div class="g-mini">
    <div
      class="m-bg"
      @click="isShowLyric = !isShowLyric"
      :class="{ show: isShowLyric }"
    >
      <my-image
        class="bg"
        :ImgUrl="getBG"
        Radius="0"
        :defaultBg="true"
        :Size="isShow ? height + 'px' : width + 'px'"
      ></my-image>

      <div
        class="m-handle"
        @click.stop="
          {
          }
        "
      >
        <div>╳</div>
        <div @click="handleChangeMini">□</div>
      </div>
      <div class="m-lyric-box">
        <Lyric></Lyric>
      </div>
      <div
        class="m-header"
        @click.stop="
          {
          }
        "
      >
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
      <div
        class="m-footer"
        @click.stop="
          {
          }
        "
        :class="{ 'footer-active': isShow }"
      >
        <div class="m-songpic" @click="openPlaying">
          <my-image
            :ImgUrl="
              (getPlayInfo && getPlayInfo.al && getPlayInfo.al.picUrl) ||
                getPlayInfo.album.picUrl
            "
            Size="100%"
            Radius="4"
          ></my-image>

          <div class="m-warper">
            <i class="iconfont" v-if="!isShow">&#xe628;</i>
            <i class="iconfont" v-else>&#xe621;</i>
          </div>
        </div>
        <div class="m-play-box">
          <div class="flex-justify-between">
            <div class="m-info">
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
              <div
                class="m-word"
                :class="{ active: isShowLyric }"
                @click="isShowLyric = !isShowLyric"
              >
                <i class="iconfont">&#xe671;</i>
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
    <div class="m-song-list" v-show="isShowList" :style="{ top: width + 'px' }">
      <ul>
        <li
          v-for="item in getList"
          :key="item.id"
          :class="{ active: id === item.id, play: getPlayInfo.id === item.id }"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import MyImage from "@/components/Image";
import { getStorage } from "@/lib/store";
import Lyric from "@/components/Lyric";

export default {
  components: {
    MyImage,
    Lyric
  },
  data () {
    return {
      id: 0,
      width: 0,
      height: 0,
      isShowLyric: false,
      isShow: false,
      isShowList: false,
      volume: 0,
      currentTime: 0,
      duration: 0
    };
  },
  computed: {
    getBG () {
      return (
        (this.getPlayInfo &&
          this.getPlayInfo.al &&
          this.getPlayInfo.al.picUrl) ||
        this.getPlayInfo.album.picUrl
      );
    },
    getList () {
      return this.$store.state.Play.playList;
    },
    playing () {
      return this.$store.state.Play.isPlay;
    },
    getPlayInfo () {
      return this.$store.state.Play.playInfo;
    },
    getFm () {
      return this.$store.state.Play.isFM;
    },
    getIsLike () {
      return getStorage("likeMusicIds").includes(this.getPlayInfo.id);
    }
  },
  created () {
    ipcRenderer.on("getMiniInfo", (event, data) => {
      switch (data.type) {
        case "currentTime":
          this.currentTime = data.data;
          break;
        case "duration":
          this.duration = data.data;
          break;
        case "volume":
          this.volume = data.data;
          break;
        default:
          break;
      }
    });
    ipcRenderer.on("getSize", (event, data) => {
      this.width = data.width;
      this.height = data.height;
    });
  },
  mounted () {
    this.volume = this.$store.state.Play.volume;

    this.width = ipcRenderer.sendSync("getBounds").width;
    this.height = ipcRenderer.sendSync("getBounds").width;
  },
  methods: {
    getSongName (item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },

    handleChangeMini () {
      ipcRenderer.send("changeMini");
    },
    handleChange () { },
    handleInput () { },
    handleLike () { },
    handleOpen () {
      this.height = ipcRenderer.sendSync("getBounds").height;
      // ipcRenderer.on("getBoundsData", function (e, data) {
      // });
      this.isShowList = !this.isShowList;
      if (this.isShowList) {
        ipcRenderer.send(
          "setBounds",
          this.height + 200,
          this.isShowList,
          "list"
        );
      } else {
        ipcRenderer.send("setBounds", this.width, this.isShowList, "list");
      }
    },
    handleVolume (volume) {
      this.volume = volume;
      ipcRenderer.send("control", { type: "volume", data: volume });
    },
    handleClick (type) {
      if (type === "play") {
        this.$store.commit("SET_ISPLAY", !this.$store.state.Play.isPlay);
      } else {
        // this.$store.commit("GET_PLAY_INFO");
      }
      ipcRenderer.send("control", { type: type });
    },
    openPlaying () {
      this.isShow = !this.isShow;
      if (this.isShow) {
        ipcRenderer.send("setBounds", 50, this.isShow, "window");
      } else {
        console.log(this.width);

        ipcRenderer.send("setBounds", this.width, this.isShow, "window");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.g-mini {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .m-bg {
    position: relative;
    -webkit-app-region: drag;
    &:hover {
      .m-header,
      .m-footer {
        display: flex;
      }
    }
    &.lyric-active {
      .bg {
        animation: opcity all 0.3s linear;
        // filter: blur(30px);
      }
    }
    .m-header,
    .m-footer {
      display: none;
      position: absolute;
      left: 0;
      width: 100%;
      height: 50px;
      background: rgba(237, 237, 237, 0.9);
    }
    .m-header {
      align-items: center;
      top: 0;
      z-index: 10;
    }
    .m-footer {
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 25px;
      bottom: 0;
      z-index: 99;
    }
    .footer-active {
      background: #f9f9f9;
      .m-info {
        display: block;
      }
      .m-play-btn {
        display: none;
      }
      &:hover {
        .m-info {
          display: none;
        }
        .m-play-btn {
          display: flex;
        }
      }
    }
  }

  .m-handle {
    position: fixed;
    left: 5px;
    top: 5px;
    z-index: 1000;
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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    p {
      font-size: 12px;
      color: #939393;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
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
      line-height: 33px;
      text-align: center;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: #333215;
      background-size: cover;
      cursor: pointer;
      .iconfont {
        font-size: 24px;
        color: #fff;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }

  .m-play-box {
    position: relative;
    margin-left: 5px;
    flex: 1;
    .m-info {
      display: none;
      flex: 1;

      h3 {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      p {
        font-size: 10px;
        color: #939393;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .m-play-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-right: 195px;
      .m-play {
        margin: 0 25px;
        .iconfont {
          font-size: 26px;
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
        line-height: 1;
        margin-left: 13px;
      }
      .m-word {
        .iconfont {
          font-size: 16px;
        }
        &.active {
          .iconfont {
            color: @brand-color;
          }
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
  .m-song-list {
    flex: 1;
    overflow: scroll;
    li {
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      color: #444;
      padding: 0 5px 0 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      cursor: default;
      &:nth-child(2n -1) {
        background: #fafafa;
      }
      &:hover {
        background: #f2f2f3;
      }
      &.active {
        background: #efefef;
      }
      &.play {
        color: @brand-color;
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
        margin: 2px 0;
        height: 2px;
        cursor: default;
        background: #bababa;
      }
      .el-slider__bar {
        background: @brand-color;
        height: 2px;
      }
      .el-slider__button-wrapper {
        width: 8px;
        height: 8px;
        top: -11px;
        cursor: default;
      }
      .el-slider__button {
        width: 8px;
        height: 8px;
        line-height: 1;
        background: @brand-color;
        border: 0;
        cursor: default;
      }
    }
  }

  .m-lyric-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    opacity: 0;
    text-align: center;
    transition: all 0.7s linear;
    background: rgba(0, 0, 0, 0.7);
    .g-lyric {
      height: 100%;
      .m-lyric {
        padding: 50px 0;
        &.m-no {
          color: #fff;
        }
        li {
          &.active {
            color: #fff;
          }
        }
      }
    }
  }
  .m-bg {
    &.show {
      .bg {
        filter: blur(30px);
      }
      .m-lyric-box {
        visibility: visible;
        opacity: 1;
      }
    }
  }
}
</style>
