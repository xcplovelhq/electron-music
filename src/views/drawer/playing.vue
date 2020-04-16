<template>
  <div class="g-playing">
    <div class="m-playing">
      <div
        class="m-btn"
        :style="{ transform: `rotate(${playing ? 0 : -30}deg)` }"
      >
        <img src="../../assets/playing-btn.png" />
      </div>
      <div class="m-circle-bg  z-rotate" :class="{ 'z-norotate': !playing }">
        <Avata
          :ImgUrl="
            (getPlayInfo && getPlayInfo.al && getPlayInfo.al.picUrl) ||
              getPlayInfo.album.picUrl
          "
          style="margin: 0 auto;"
          Size="210"
        ></Avata>
      </div>
    </div>
    <div class="m-song"></div>
  </div>
</template>

<script>
import Avata from "@/components/Avata";

export default {
  components: {
    Avata
  },
  computed: {
    getPlayInfo () {
      return this.$store.state.Play.playInfo;
    },
    playing () {
      return this.$store.state.Play.isPlay;
    }
  }
};
</script>

<style lang="less" scoped>
.g-playing {
  display: flex;
  justify-content: center;
  .m-playing {
    padding-top: 46px;
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
