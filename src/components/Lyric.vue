<template>
  <div class="g-lyric">
    <div class="m-lyric" ref="lyric" :class="{ 'm-no': getLyric.length === 0 }">
      <ul v-if="getLyric && getLyric.length > 0">
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
      <div v-else>
        纯音乐，请你欣赏
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String
  },
  data() {
    return {
      lyricIdx: 0,
      pattern: /(\[\d{2}:\d{2}\.\d{2,3}\])/g
    };
  },
  computed: {
    getLyric() {
      let newLyric = [];
      let playLyric = this.$store.state.Play.playLyric;
      if (this.type === "fm") {
        playLyric = this.$store.state.Play.fmLyric;
      }

      if (playLyric && playLyric.lrc) {
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
      }

      return newLyric;
    }
  },
  methods: {
    setTime(data) {
      let time = data.slice(1, -1);
      if (time.indexOf(":") >= 0) {
        time = time.replace(":", "").replace(".", "");
      }

      return time;
    },
    getCurrentTime() {
      let currentTime = (this.$store.state.Play.currentTime * 1000).toFixed(0);
      return this.$moment(+currentTime).format("mmssSSS");
    },
    getActiveLyric(row, idx) {
      if (row.time < this.getCurrentTime() && this.lyricIdx <= idx) {
        this.lyricIdx = idx;
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="less">
.g-lyric {
  width: 100%;
  height: 350px;

  .m-lyric {
    width: 100%;
    height: 100%;
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
</style>
