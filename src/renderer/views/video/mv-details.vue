<template>
  <div class="g-mv-details">
    <g-header></g-header>
    <div class="m-main">
      <div class="g-warper">
        <div class="m-details">
          <div class="m-back"><i class="iconfont">&#xe617;</i>视频详情</div>
          <!-- <div
            class="m-video"
            ref="videoContainer"
            :class="{ 'm-isfull': isFull }"
          >
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
              <img src="../../assets/play.png" />
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
          </div> -->
          <my-video :id="$route.query.id" :type="$route.query.type"></my-video>
          <div class="m-name">
            <div class="m-username">
              <router-link to="">
                <avata
                  :ImgUrl="
                    (info.creator && info.creator.avatarUrl) || info.cover
                  "
                  Size="50"
                ></avata>
              </router-link>
              <router-link to="">
                {{ (info.creator && info.creator.nickname) || info.artistName }}
              </router-link>
            </div>
          </div>
          <div class="m-title">
            {{ info.title }}
          </div>
          <div class="m-publishtime">
            发布：{{ $moment(info.publishTime).format("YYYY-MM-DD") }}
            <span>播放：{{ info.praisedCount || info.playCount }}次</span>
          </div>
          <div class="m-gruop">
            <router-link to="" v-for="item in info.videoGroup" :key="item.id">{{
              item.name
            }}</router-link>
          </div>
          <comment-list
            :type="$route.query.type"
            class="m-comment"
          ></comment-list>
        </div>
        <div class="m-recommend">
          <div class="m-recommend-item" v-for="item in mvList" :key="item.id">
            <div class="m-img">
              <mv-image
                :mv="item"
                @click="handleClick(item)"
                :type="$route.query.type"
              ></mv-image>
            </div>
            <div class="m-text">
              <div class="m-song">
                {{ item.name || item.title }}
              </div>
              <div class="m-singer">
                <span v-if="item.creator && item.creator.length > 0">by</span
                ><router-link to="">{{
                  item.artistName || item.creator[0].userName
                }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GHeader from "@/components/common/Header";
import MvImage from "@/components/MvImage";
import Avata from "@/components/Avata";
import CommentList from "@/components/CommentList";
import MyVideo from "@/components/Video";

export default {
  components: { GHeader, MvImage, Avata, CommentList, MyVideo },
  data() {
    return {
      info: {},
      isFull: false,
      volume: 1,
      duration: 0,
      currentTime: 0,
      isPlay: false,
      video: null,
      videoUrl: "",
      mvList: []
    };
  },
  created() {
    if (this.$route.query.type === "video") {
      this.getVideoDetail();
      this.getVideoUrl();
      this.getRelatedAllvideo();
    } else {
      this.getData();
      this.getSimiMv();
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

    getVideoDetail() {
      this.$api.videoData
        .getVideoDetail({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.info = data.data;
          console.log(data);
        });
    },
    getVideoUrl() {
      this.$api.videoData
        .getVideoUrl({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.videoUrl = data.urls[0].url;
        });
    },
    getRelatedAllvideo() {
      this.$api.videoData
        .getRelatedAllvideo({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.mvList = data.data;
        });
    },

    getData() {
      this.$api.videoData
        .getMvDetails({
          mvid: this.$route.query.id
        })
        .then(({ data }) => {
          this.info = data.data;
          console.log(data);
        });
    },
    getMvUrl() {
      this.$api.videoData
        .getMvUrl({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.videoUrl = data.data.url;
        });
    },
    getSimiMv() {
      this.$api.videoData
        .getSimiMv({
          mvid: this.$route.query.id
        })
        .then(({ data }) => {
          this.mvList = data.mvs;
          console.log(data);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-mv-details {
  height: 100%;
  .m-main {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
  .g-warper {
    display: flex;
    justify-content: space-between;
    padding: 15px 30px;
  }
  .m-details {
    flex: 1;
    .m-back {
      .iconfont {
        margin-right: 5px;
      }
    }
    .m-name {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .m-username {
        display: flex;
        align-items: center;
        a {
          margin-right: 10px;
          font-size: 13px;
          color: #333;
          &:hover {
            color: #000;
          }
        }
      }
    }
    .m-title {
      margin-top: 20px;
      font-size: 20px;
    }
    .m-publishtime {
      margin-top: 10px;
      font-size: 12px;
      color: #bfbfbf;
      span {
        margin-left: 20px;
      }
    }
    .m-gruop {
      margin-top: 10px;
      a {
        margin-right: 5px;
        font-size: 12px;
        color: #333;
        padding: 3px 10px;
        border-radius: 10px;
        background: #f8f8f8;
      }
    }
    .m-comment {
      margin-top: 40px;
    }
  }
  .m-recommend {
    margin-left: 30px;
    flex: 1;
    .m-recommend-item {
      margin-bottom: 12px;
      display: flex;
    }
    .m-img {
      width: 140px;
    }
    .m-text {
      margin-left: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .m-song {
        font-size: 13px;
        color: #333;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        &:hover {
          color: #000;
        }
      }
      .m-singer {
        font-size: 12px;
        a {
          color: #bebebe;
          &:hover {
            color: #999;
          }
        }
        span {
          color: #989898;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
