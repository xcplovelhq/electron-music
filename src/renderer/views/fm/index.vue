<template>
  <div class="g-fm">
    <div class="g-warper">
      <div class="flex-justify-center">
        <div class="m-playing">
          <div class="m-imgs">
            <div class="m-img-list">
              <template v-for="(item, idx) in list">
                <div
                  class="m-play-img"
                  :class="getPlayIdx(idx)"
                  v-if="playIdx - 3 < idx"
                  :key="idx"
                  ref="playImg"
                >
                  <my-image
                    style="margin: 0 auto;"
                    :ImgUrl="item.album.picUrl"
                    Size="100%"
                    Radius="8"
                  ></my-image>
                </div>
              </template>
              <div
                class="m-btn"
                @click="handlePlay"
                :class="{ active: !playing }"
              >
                <img v-if="!playing" src="~@/assets/play.png" />
                <img v-else src="~@/assets/pause.png" />
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div class="m-song">
          <div class="m-name">
            <h3>{{ getPlayInfo.name }}</h3>
            <p></p>
          </div>
          <div class="m-info">
            <div>
              专辑：<router-link to="">{{
                getPlayInfo.album && getPlayInfo.album.name
              }}</router-link>
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
          </div>
          <Lyric type="fm"></Lyric>
        </div>
      </div>
      <div class="flex-justify-between" style="margin-top:60px">
        <comment-list
          :type="type"
          :random="random"
          class="m-comment"
        ></comment-list>
      </div>
    </div>
  </div>
</template>

<script>
import { getSingerName, getSum } from "@/lib/utils";
import CommentList from "@/components/CommentList";
import MyImage from "@/components/Image";
// import Loading from "@/components/Loading";
import Lyric from "@/components/Lyric";

export default {
  components: {
    MyImage,
    CommentList,
    // Loading,
    Lyric
  },
  data() {
    return {
      // pattern: /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g,
      isLoading: false,
      playIdx: 0,
      type: "playing",
      list: [],
      isStart: true,
      random: 0
    };
  },
  computed: {
    getPlayInfo() {
      return this.$store.state.Play.fmInfo;
    },
    playing() {
      let isPlay = false;
      if (this.getFm) {
        isPlay = this.$store.state.Play.isPlay;
      }
      return isPlay;
    },
    isNext() {
      return this.$store.state.Play.isNext;
    },
    getFm() {
      return this.$store.state.Play.isFM;
    }
  },
  created() {
    this.getPersonalFm();
  },
  methods: {
    handlePlay() {
      this.$store.commit("SET_FM", true);
      if (!this.$store.state.Play.isPlay) {
        this.$store.commit("SET_ISPLAY", true);
      } else {
        this.$store.commit("SET_ISPLAY", false);
      }
      if (this.isStart) {
        this.getData();
      }
    },
    getPlayIdx(idx) {
      if (this.playIdx === idx) {
        return "active";
      } else if (this.playIdx - 1 === idx) {
        return "prev";
      } else if (this.playIdx - 2 === idx) {
        return "old";
      }
    },

    getPlayCount(row) {
      return getSum(row.playCount);
    },

    getSingerName(row, idx) {
      return getSingerName(row, idx);
    },
    getPersonalFm() {
      this.$api.userData.getPersonalFm().then(({ data }) => {
        data.data.forEach(item => {
          this.list.push(item);
        });
        if (!this.$store.state.Play.isPlay) {
          this.$store.commit("SET_FM", true);
        }
        this.getData();
      });
    },
    getData() {
      this.$store.commit("SET_FM_INFO", this.list[this.playIdx]);
      this.$store
        .dispatch("getLyric", {
          id: this.list[this.playIdx].id,
          type: "FM"
        })
        .then(() => {
          this.isLoading = false;
        });
      if (this.getFm) {
        this.isStart = false;
        this.$store.commit("SET_PLAY_INFO", this.list[this.playIdx]);
        this.$store.dispatch("getSongUrl", {
          id: this.list.map(item => item.id)
        });
        this.random = Math.floor(Math.random() * 100 - 2);
        this.$store.commit("SET_ISPLAY", true);
      }
    }
  },
  watch: {
    isNext() {
      this.playIdx++;
      this.isStart = false;
      this.$store.commit("SET_FM", true);
      this.isLoading = true;

      if ((this.playIdx + 1) % 3 === 0) {
        this.getPersonalFm();
      } else {
        this.getData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.g-fm {
  height: 100%;
  overflow-y: auto;
  .g-warper {
    width: 800px;
    margin: 0 auto;
  }

  .m-playing {
    flex: 1;
    .m-imgs {
      display: flex;
      justify-content: flex-end;
      height: 270px;
      position: relative;
      overflow: hidden;
      .m-btn {
        position: absolute;
        right: 10px;
        bottom: 10px;
        width: 44px;
        transition: all 0.3s linear;
        img {
          width: 100%;
        }
        &.active {
          width: 53px;
          right: 50%;
          bottom: 50%;
          transform: translate(50%, 50%);
        }
      }
      .m-img-list {
        width: 270px;
        height: 100%;
        position: relative;
      }
      .m-play-img {
        position: absolute;
        right: 0;
        top: 0;
        width: 270px;
        transition: all 0.5s linear;
        border-radius: 8px;
        border: 1px solid #f3f3f3;
        opacity: 0;
        transform: translateX(270px);
        &.prev {
          opacity: 1;
          transform: translateX(-70px) scale(0.8);
        }
        &.active {
          opacity: 1;
          transform: translateX(0px);
        }
        &.old {
          transform: translateX(-120px) scale(0.7);
          // top: 40px;
          // height: 190px;
          opacity: 0;
        }
      }
    }
  }
  .z-right {
    animation: circleRotate 1s linear;
  }
  .m-song {
    width: 400px;
    margin-left: 50px;
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
      &.m-no {
        display: flex;
        justify-content: center;
        align-items: center;
      }
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
}
</style>
