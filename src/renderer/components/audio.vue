<template>
  <div class="g-audio">
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
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  mounted() {
    this.audio = this.$refs.audio;
    console.log("321312321321");
  },
  computed: {
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
    getPlayInfo() {
      return this.$store.state.Play.playInfo;
    },
    getVolume() {
      return this.$store.state.Play.volume;
    },
    playing() {
      if (this.$store.state.Play.isPlay) {
        this.audio && this.audio.play();
      } else {
        this.audio && this.audio.pause();
      }
      return this.$store.state.Play.isPlay;
    }
  },
  methods: {
    getDuration(e) {
      this.$store.commit("SET_DURATION", Math.floor(e.target.duration));
      ipcRenderer.send("setMiniInfo", {
        type: "duration",
        data: this.duration
      });
    },
    getTimeupdate(e) {
      this.$store.commit("SET_CURRENT_TIME", Math.floor(e.target.currentTime));
      ipcRenderer.send("setMiniInfo", {
        type: "currentTime",
        data: this.currentTime
      });
    },
    getEnded() {
      this.getPLayList("NEXT", "END");
    }
  },
  watch: {
    getVolume(data) {
      this.audio.volume = data;
    }
  }
};
</script>

<style lang="less" scoped>
.g-audio {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
