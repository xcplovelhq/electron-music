<template>
  <div class="g-model-lyric">
    <div class="m-close" @click="handleClose">╳</div>
    <div class="m-lyric-box">
      <Lyric :isTranslate="true"></Lyric>
    </div>
  </div>
</template>

<script>
import Lyric from "@/components/Lyric";
import { ipcRenderer } from "electron";

export default {
  components: {
    Lyric
  },
  methods: {
    handleClose() {
      ipcRenderer.send("setLyric", false);
      this.$store.commit(
        "SET_ISSHOWLYRIC",
        !this.$store.state.Play.isShowLyric
      );
    }
  }
};
</script>

<style lang="less">
.g-model-lyric {
  position: relative;
  width: 100%;
  height: 100%;
  -webkit-app-region: drag;
  background: rgba(0, 0, 0, 0.3);
  .m-close {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 12px;
    color: #fff;
  }
  .m-lyric-box {
    height: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    .g-lyric {
      height: 100%;
    }
    li {
      display: none;
      height: 63px;
      line-height: 63px;
      &.active {
        color: #fff;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          font-weight: 300;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
