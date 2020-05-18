<template>
  <div class="g-full-screen">
    <div class="m-img">
      <img
        :src="
          (getPlayInfo && getPlayInfo.al && getPlayInfo.al.picUrl) ||
            getPlayInfo.album.picUrl
        "
      />
    </div>
    <div class="m-warper">
      <div class="m-playing">
        <div
          class="m-btn"
          :style="{ transform: `rotate(${playing ? -8 : -40}deg)` }"
        >
          <img src="../../assets/playing-btn.png" />
        </div>
        <div class="m-circle-bg  z-rotate" :class="{ 'z-norotate': !playing }">
          <my-image
            style="margin: 0 auto;"
            :ImgUrl="
              (getPlayInfo && getPlayInfo.al && getPlayInfo.al.picUrl) ||
                getPlayInfo.album.picUrl
            "
            Size="300px"
            Radius="200"
          >
            <div class="m-playing-btn" slot="btn" @click="handleClick">
              <i class="iconfont" v-if="!playing">&#xe63e;</i>
              <i class="iconfont" v-else>&#xe62a;</i>
            </div>
          </my-image>
        </div>
      </div>
      <div class="m-title">
        {{ getPlayInfo.name
        }}<span
          v-for="(v, idx) in getPlayInfo.ar || getPlayInfo.artists"
          :key="v.id"
          >{{ getSingerName(v, idx) }}</span
        >
      </div>
      <div class="m-lyric-box">
        <Lyric :isTranslate="true"></Lyric>
      </div>
      <div class="m-order">
        <div class="m-order-btn">
          <i class="iconfont active" v-if="getIsLike">&#xeca2;</i>
          <i class="iconfont" v-else>&#xeca1;</i>
        </div>
        <div class="m-order-btn">
          <i class="iconfont">&#xe60b;</i>
        </div>
        <div class="m-order-btn">
          <Loop></Loop>
        </div>
      </div>
      <div class="m-left">
        <i class="iconfont">&#xe727;</i>
      </div>
      <div class="m-right">
        <i class="iconfont">&#xe728;</i>
      </div>
    </div>
  </div>
</template>

<script>
import MyImage from "@/components/Image";
import Lyric from "@/components/Lyric";
import Loop from "@/components/Loop";

export default {
  components: {
    MyImage,
    Lyric,
    Loop
  },
  computed: {
    getIsLike () {
      return this.$store.state.User.likeMusicIds.includes(this.getPlayInfo.id);
    },
    getPlayInfo () {
      return this.$store.state.Play.playInfo;
    },
    getPlayDetails () {
      return this.$store.state.Play.playDetails;
    },
    playing () {
      return this.$store.state.Play.isPlay;
    }
  },
  methods: {
    getSingerName (row, idx) {
      if (idx > 0) {
        return " , " + row.name;
      } else {
        return row.name;
      }
    },
    handleClick () {
      this.$store.commit("SET_ISPLAY", !this.playing);
    }
  }
};
</script>

<style lang="less" scoped>
.g-full-screen {
  width: 100%;
  height: 100%;
  .m-img {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: 1;
    overflow: hidden;
    filter: blur(50px);
    img {
      width: 100%;
      height: 120%;
    }
  }
  .m-warper {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.2);
  }
  .m-playing {
    .m-btn {
      position: relative;
      width: 155px;
      margin: -22px auto;
      z-index: 100;
      transition: 0.3s linear;
      transform-origin: 23px 23px;
      img {
        width: 100%;
      }
    }
  }
  .m-title {
    margin-top: 18px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  .m-lyric-box {
    width: 700px;
    height: 130px;
    margin: 0 auto;
    text-align: center;
    .m-lyric {
      border: 0;
    }
  }
  .m-order {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .m-order-btn {
      width: 64px;
      height: 64px;
      margin-right: 50px;
      text-align: center;
      line-height: 64px;
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.3);
      &:hover {
        background: rgba(255, 255, 255, 0.6);
      }
      &:last-child {
        margin: 0;
      }
      .iconfont {
        font-size: 30px !important;
        color: #fff;
        &.active {
          color: @brand-color;
        }
      }
    }
  }
  .m-left,
  .m-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 70px;
    height: 72px;
    line-height: 72px;
    text-align: center;
    background: rgba(255, 255, 255, 0.3);

    .iconfont {
      font-size: 26px !important;
      color: #fff;
    }
  }
  .m-left {
    left: 0;
    border-radius: 0 50px 50px 0;
  }
  .m-right {
    right: 0;
    border-radius: 50px 0 0 50px;
  }
}
</style>
<style lang="less">
.g-full-screen {
  .m-lyric-box {
    width: 700px;
    margin: 0 auto;
    text-align: center;
    .g-lyric {
      height: 130px;
    }
    .m-lyric {
      border: 0;
      li {
        font-size: 16px;
        color: #cfbdb5;
        &.active {
          font-size: 18px;

          color: #fff;
        }
      }
    }
  }
  .m-order-btn {
    .iconfont {
      font-size: 30px;
      color: #fff;
    }
  }
  .m-circle-bg {
    position: relative;
    width: 470px;
    height: 470px;
    padding-top: 69px;
    margin: -120px auto 0;
    border-radius: 50%;
    text-align: center;
    border: 16px solid rgba(255, 255, 255, 0.1);
    background: url("../../assets/disc.png") no-repeat top center;
    background-size: cover;
    overflow: hidden;
    z-index: 99;
    &.z-rotate {
      animation: circleRotate 20s infinite linear;
      animation-play-state: running;
    }
    &.z-norotate {
      animation-play-state: paused;
    }
    .g-image {
      &:hover {
        .m-playing-btn {
          display: block;
        }
      }
    }
  }
  .m-playing-btn {
    display: none;
    position: absolute;
    left: 50%;
    top: 0px;
    width: 300px;
    height: 300px;
    line-height: 300px;
    text-align: center;
    border-radius: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    .iconfont {
      font-size: 100px;
      color: #fff;
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
