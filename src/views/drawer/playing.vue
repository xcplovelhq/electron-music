<template>
  <div class="g-playing">
    <div class="m-header">
      <div class="m-back" @click="handleBack">
        <i class="iconfont">&#xeb66;</i>
      </div>
    </div>
    <div class="g-play-warper">
      <div class="flex-justify-center">
        <div class="m-playing">
          <div
            class="m-btn"
            :style="{ transform: `rotate(${playing ? 0 : -30}deg)` }"
          >
            <img src="../../assets/playing-btn.png" />
          </div>
          <div
            class="m-circle-bg  z-rotate"
            :class="{ 'z-norotate': !playing }"
          >
            <my-image
              style="margin: 0 auto;"
              :ImgUrl="
                (getPlayInfo && getPlayInfo.al && getPlayInfo.al.picUrl) ||
                  getPlayInfo.album.picUrl
              "
              Size="210px"
              Radius="200"
            ></my-image>
          </div>
        </div>
        <div class="m-song">
          <div class="m-name">{{ getPlayInfo.name }}</div>
          <div class="m-info">
            <div>
              专辑：<router-link to="">{{ getPlayInfo.al.name }}</router-link>
            </div>
            <div>
              歌手：<router-link
                :to="{
                  name: 'singerDetails',
                  query: { id: v.id }
                }"
                v-for="(v, idx) in getPlayInfo.ar || getPlayInfo.artists"
                :key="v.id"
                >{{ getSingerName(v, idx) }}</router-link
              >
            </div>
            <div>
              来源：<router-link to="">{{ getPlayDetails.name }}</router-link>
            </div>
          </div>
          <div class="m-lyric" ref="lyric">
            <ul>
              <template v-for="(item, idx) in getLyric">
                <li
                  :key="item.key"
                  :class="{ active: getActiveLyric(item, idx) }"
                  :ref="getActiveLyric(item, idx) && 'itemLyric'"
                >
                  <p>{{ item.lyric }}</p>
                  <p v-if="item.tlyric">{{ item.tlyric }}</p>
                  <!-- {{ item }} -->
                </li>
              </template>
            </ul>
          </div>
          <!-- {{ getLyricTime }} -->
        </div>
      </div>
      <div class="flex-justify-between" style="margin-top:60px">
        <comment-list :type="type" class="m-comment"></comment-list>
        <div class="m-right">
          <!-- <loading></loading> -->
          <div class="m-list" v-for="item in rightList" :key="item.title">
            <div class="m-title">{{ item.title }}</div>
            <ul>
              <li class="m-item" v-for="v in item.list" :key="v.id">
                <!-- <Avata
                  :ImgUrl="
                    (v.album && v.album.picUrl) || v.avatarUrl || v.coverImgUrl
                  "
                  Size="50"
                  :Radius="item.radius"
                  v-if="item.type"
                ></Avata> -->
                <m-image
                  :ImgUrl="
                    (v.album && v.album.picUrl) || v.avatarUrl || v.coverImgUrl
                  "
                  Size="50px"
                  :IconSize="item.type === 'music' ? '20px' : ''"
                  :Radius="item.radius"
                >
                </m-image>
                <div class="m-right-info">
                  <h3>
                    {{ v.name || v.nickname
                    }}<i class="iconfont m-sex" v-if="v.gender == 1">&#xe612;</i
                    ><i class="iconfont m-sex m-women" v-if="v.gender == 2"
                      >&#xe613;</i
                    >
                  </h3>
                  <p v-if="item.type === 'song'">
                    <i class="iconfont">&#xe607;</i>{{ getPlayCount(v) }}
                  </p>
                  <p v-if="item.type === 'music'">
                    <span v-for="(i, idx) in v.artists" :key="i.id">{{
                      getSingerName(i, idx)
                    }}</span>
                  </p>
                  <p v-else>{{ v.recommendReason }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mImage from "@/components/Image";

import { getSingerName, getSum } from "@/lib/utils";
import CommentList from "@/components/CommentList";
// import Loading from "@/components/Loading";
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage,
    CommentList,
    // Loading,
    mImage
  },
  data() {
    return {
      isLoading: false,
      // pattern: /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g,
      pattern: /(\[\d{2}:\d{2}\.\d{2,3}\])/g,
      pattern2: /[\r\n]/g,
      lyricIdx: 0,
      offsetTop: 0,
      type: "playing",
      rightList: [
        {
          title: "包含这首歌的歌单",
          radius: "8",
          type: "song",
          list: []
        },
        {
          title: "相似歌曲",
          radius: "8",
          type: "music",
          list: []
        },
        {
          title: "喜欢这首歌的人",
          radius: "",
          type: "user",
          list: []
        }
      ]
    };
  },
  computed: {
    getPlayInfo() {
      return this.$store.state.Play.playInfo;
    },
    getPlayDetails() {
      return this.$store.state.Play.playDetails;
    },
    playing() {
      return this.$store.state.Play.isPlay;
    },

    getLyric() {
      let newLyric = [];
      let playLyric = this.$store.state.Play.playLyric;
      let lyric = playLyric.lrc.lyric;
      let lyricArr = lyric.split(this.pattern).slice(1);

      lyricArr.forEach((item, idx) => {
        if (idx % 2 === 0) {
          newLyric.push({
            time: this.setTime(lyricArr[idx]),
            lyric: lyricArr[idx + 1]
          });
        }
      });
      if (playLyric.tlyric.lyric) {
        let tlyricArr = playLyric.tlyric.lyric.split(this.pattern).slice(1);
        tlyricArr.forEach((item, idx) => {
          if (idx % 2 === 0) {
            newLyric.forEach((v, i) => {
              if (v.time === this.setTime(tlyricArr[idx])) {
                newLyric[i].tlyric = tlyricArr[idx + 1];
              }
            });
          }
        });
      }
      return newLyric;
    },
    getLyricTime() {
      const lyric = this.$store.state.Play.playLyric.lrc.lyric;
      const arr = lyric.match(this.pattern);
      return arr;
    }
  },
  created() {
    this.getSimiPlaylist();
    this.getSimiSong();
    this.getSimiUser();
  },
  methods: {
    handleBack() {
      this.$store.commit("CHANGE_PLAYING_DRAWER_STATUS", false);
    },
    setTime(data) {
      let time = data.slice(1, -1);
      if (time.indexOf(":") >= 0) {
        time = time.replace(":", "").replace(".", "");
      }

      return time;
    },
    getPlayCount(row) {
      return getSum(row.playCount);
    },

    getSingerName(row, idx) {
      return getSingerName(row, idx);
    },
    getCurrentTime() {
      let currentTime = (this.$store.state.Play.currentTime * 1000).toFixed(0);

      // if (currentTime > 0) {
      //   this.offsetTop =
      //     this.$refs.itemLyric && this.$refs.itemLyric[0].offsetTop;
      //   console.log(this.offsetTop);
      //   this.$nextTick(() => {
      //     //图片列表栏始终左对齐
      //     this.$refs.lyric.scrollTo({
      //       top: this.offsetTop,
      //       behavior: "smooth"
      //     });
      //   });
      // }

      return this.$moment(+currentTime).format("mmssSSS");
    },

    getActiveLyric(row, idx) {
      if (row.time < this.getCurrentTime() && this.lyricIdx <= idx) {
        this.lyricIdx = idx;
        return true;
      } else {
        return false;
      }
    },
    getSimiPlaylist() {
      this.$api.songData
        .getSimiPlaylist({
          id: this.getPlayInfo.id
        })
        .then(({ data }) => {
          this.rightList[0].list = data.playlists;
        });
    },
    getSimiSong() {
      this.$api.musicData
        .getSimiSong({
          id: this.getPlayInfo.id
        })
        .then(({ data }) => {
          this.rightList[1].list = data.songs;
        });
    },
    getSimiUser() {
      this.$api.userData
        .getSimiUser({
          id: this.getPlayInfo.id
        })
        .then(({ data }) => {
          this.rightList[2].list = data.userprofiles;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-playing {
  height: 100%;
  overflow-y: auto;
  .g-play-warper {
    width: 880px;
    margin: 0 auto;
  }
  .m-back {
    position: absolute;
    left: 90px;
    top: 8px;
    cursor: pointer;
  }
  .m-header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 50px;
    z-index: 1000;
    background: #fff;
  }
  .m-playing {
    .m-btn {
      position: relative;
      width: 114px;
      margin-left: 140px;
      z-index: 100;
      transition: 0.3s linear;

      transform-origin: 16px 16px;
      img {
        width: 100%;
      }
    }
    .m-circle-bg {
      width: 330px;
      height: 330px;
      margin-top: -85px;
      border-radius: 50%;
      padding-top: 52px;
      text-align: center;
      border: 8px solid #eaeaea;
      background: url("../../assets/disc.png") top center;
      background-size: cover;
      z-index: 99;
      &.z-rotate {
        animation: circleRotate 20s infinite linear;
        animation-play-state: running;
      }
      &.z-norotate {
        animation-play-state: paused;
      }
    }
  }
  .m-song {
    width: 400px;
    margin-left: 70px;
    padding-top: 50px;
    .m-name {
      font-size: 22px;
    }
    .m-info {
      display: flex;
      margin-top: 10px;
      margin-bottom: 30px;
      div {
        display: flex;
        flex: 1;
        font-size: 12px;
        color: #6d6d6d;
      }
      a {
        font-size: 12px;
        color: #607cac;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .m-lyric {
      width: 100%;
      height: 350px;
      border-right: 2px solid #f4f4f5;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      ul {
        width: 100%;
      }
      li {
        width: 100%;
        font-size: 14px;
        color: #747474;
        padding: 6px 0;
        transition: 0.3s all linear;
        p {
          line-height: 1.4;
          padding: 0;
        }

        &.active {
          font-size: 16px;
          color: #000;
        }
      }
    }
  }
  .m-comment {
    flex: 1;
  }
  .flex-justify-between {
    align-items: flex-start;
  }
  .m-right {
    width: 270px;
    height: 100%;
    margin-left: 50px;
    .m-list {
      margin-top: 30px;
      &:first-child {
        margin-top: 0px;
      }
      .m-title {
        margin-bottom: 10px;
      }
      li {
        display: flex;
        padding: 5px;
        border-radius: 8px;
        &:hover {
          background: #edecee;
        }
        .m-right-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 10px;
          flex: 1;
          h3 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            font-size: 14px;
            color: #424242;

            span {
              color: #9c9c9c;
            }
          }
          .m-sex {
            margin-left: 5px;
            font-size: 14px;
            color: #68b9e8;
            // background: #b3f3fe;
            &.m-women {
              color: #ff4047;
              // background: #ffced7;
            }
          }
          p {
            font-size: 12px;
            color: #7c7c7c;
            .iconfont {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
@keyframes circleRotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(1turn);
  }
}
</style>
