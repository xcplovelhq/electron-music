<template>
  <div class="g-song-sheet">
    <div class="g-warper">
      <div class="m-banner" v-if="!!highquality.coverImgUrl">
        <router-link :to="{ name: 'songSheetDetails' }">
          <img class="m-bg" :src="highquality.coverImgUrl" />
          <div class="m-bg-bg"></div>

          <div class="m-main">
            <Avata
              :ImgUrl="highquality.coverImgUrl"
              Size="138"
              Radius="8"
            ></Avata>
            <div class="m-text">
              <div class="m-medal">
                <i class="iconfont">&#xe655;</i>
                精品歌单
              </div>
              <h3>{{ highquality.name }}</h3>
              <p>{{ highquality.copywriter }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="m-nav">
        <div class="m-all">
          <div class="m-btn">全部歌单<i class="iconfont">&#xe72b;</i></div>
        </div>
        <div class="m-classify">
          <ul>
            <li v-for="item in classifyList" :key="item.id">
              <div
                class="m-name"
                :class="{ active: classifyId === item.id }"
                @click="handleClick(item)"
              >
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <song-sheet
        :list="songSheetList"
        :min="songSheetList.length"
      ></song-sheet>
    </div>
  </div>
</template>

<script>
import Avata from "@/components/Avata";
import SongSheet from "@/components/SongSheet";

export default {
  components: {
    Avata,
    SongSheet
  },
  data() {
    return {
      params: {
        limit: 10,
        cat: ""
      },

      classifyId: 0,
      highquality: {},
      classifyList: [],
      songSheetList: []
    };
  },
  created() {
    this.getPlaylistHot();
    this.getPlaylistHighquality();
    this.getTopPlaylist();
  },
  methods: {
    handleClick(row) {
      this.classifyId = row.id;
      this.params.cat = row.name;
      this.getTopPlaylist();
      this.getPlaylistHighquality();
    },
    getPlaylistHot() {
      this.$api.songData.getPlaylistHot().then(({ data }) => {
        this.classifyList = data.tags;
      });
    },
    getPlaylistHighquality() {
      this.$api.songData
        .getPlaylistHighquality({
          ...this.params
        })
        .then(({ data }) => {
          this.highquality = data.playlists[0] || {};
          // this.classifyList = data.tags;
        });
    },
    getTopPlaylist() {
      this.$api.songData
        .getTopPlaylist({
          ...this.params
        })
        .then(({ data }) => {
          this.songSheetList = data.playlists;
          // this.classifyList = data.tags;
        });
    }
  }
};
</script>

<style lang="less">
.g-song-sheet {
  padding: 20px 30px;
  .m-banner {
    position: relative;
    width: 100%;
    height: 170px;
    overflow: hidden;
    border-radius: 8px;
    .m-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      transform: scale(6);
      filter: blur(10px);
      background: #000;
    }
    .m-bg-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      opacity: 0.3;
      background: #000;
    }
    .m-main {
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 14px;
      z-index: 3;
      .m-text {
        margin-left: 10px;
        .m-medal {
          width: 100px;
          margin-bottom: 20px;
          padding: 3px 0;
          text-align: center;
          font-weight: 300;
          font-size: 14px;
          color: #edaa62;
          border-radius: 50px;
          border: 1px solid #edaa62;
        }
        h3 {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 200;
          color: #fff;
        }
        p {
          font-size: 12px;
          color: #fff;
          opacity: 0.8;
        }
      }
    }
  }
  .m-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 0;
    .m-all {
      .m-btn {
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 13px;
        color: #444;
        border: 1px solid #d9d9d9;
        border-radius: 50px;
        cursor: default;
        &:hover {
          background: #f3f3f3;
        }
        .iconfont {
          font-size: 12px;
        }
      }
    }
    .m-classify {
      ul {
        display: flex;
        li {
          border-right: 1px solid #f6f6f6;
          .m-name {
            cursor: default;
            margin: 0 5px;
            padding: 0 9px;
            text-align: center;
            font-size: 12px;
            color: #858585;
            &:hover {
              color: #444;
            }
            &.active {
              color: #c6382e;
              background: #fbf6f6;
              border-radius: 50px;
            }
            &:last-child {
              border-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
