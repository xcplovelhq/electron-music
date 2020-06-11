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
    getSlider() {
      return this.$store.state.Play.slider;
    },
    getLoopValue() {
      return this.$store.state.Play.loop;
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
      let tracks = this.$store.state.Play.playList;
      let row = this.$store.state.Play.playInfo;
      if (this.getLoopValue === "single") {
        this.audio.currentTime = 0;
        this.audio.load();
        this.$store.commit("SET_ISPLAY", true);
      } else {
        if (this.getLoopValue === "order") {
          if (row.id === tracks[tracks.length - 1].id) {
            this.$store.commit("SET_ISPLAY", false);
            this.$store.commit("SET_PLAY_INFO", {});
          }
        }
        this.$store.commit("SET_ISEND", !this.$store.state.Play.isEnd);
      }
    }
  },
  watch: {
    getVolume(data) {
      this.audio.volume = data;
    },
    getSlider(data) {
      this.audio.currentTime = data;
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
