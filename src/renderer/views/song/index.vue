<template>
  <div class="g-song-sheet">
    <div class="g-warper">
      <a-skeleton
        v-if="!highquality.coverImgUrl"
        :avatar="{ size: 170, shape: 'square' }"
        active
        :paragraph="{ rows: 4 }"
      />
      <div class="m-banner" v-if="!!highquality.coverImgUrl">
        <router-link :to="{ name: 'boutiqueSong', query: { cat: params.cat } }">
          <img class="m-bg" :src="highquality.coverImgUrl + '?param=138y138'" />
          <div class="m-bg-bg"></div>

          <div class="m-main">
            <Avata
              :ImgUrl="highquality.coverImgUrl + '?param=138y138'"
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
          <el-popover
            placement="bottom-start"
            v-model="popover"
            trigger="click"
            width="720px"
          >
            <div class="m-song-popover">
              <div class="m-popover-title">
                <div
                  class="m-name"
                  :class="{ active: params.cat === '' }"
                  @click="handleClick({ name: '' })"
                >
                  全部歌单
                </div>
              </div>
              <div
                class="m-popover-item"
                :key="item.type"
                v-for="item in songGroupList"
              >
                <div class="m-type">
                  <i class="iconfont" v-html="item.icon"></i>{{ item.type }}
                </div>
                <ul>
                  <li v-for="v in item.list" :key="v.name">
                    <div
                      class="m-name"
                      :class="{ active: params.cat === v.name }"
                      @click="handleClick(v)"
                    >
                      {{ v.name }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="m-btn" slot="reference">
              {{ params.cat || "全部视频" }}<i class="iconfont">&#xe72b;</i>
            </div>
          </el-popover>
        </div>
        <div class="m-classify">
          <ul>
            <li v-for="item in classifyList" :key="item.id">
              <div
                class="m-name"
                :class="{ active: params.cat === item.name }"
                @click="handleClick(item)"
              >
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Loading v-if="songSheetList && songSheetList.length <= 0"></Loading>

      <song-sheet
        v-else
        :list="songSheetList"
        :min="songSheetList.length"
      ></song-sheet>
    </div>
  </div>
</template>

<script>
import Avata from "@/components/Avata";
import SongSheet from "@/components/SongSheet";
import Loading from "@/components/Loading";

export default {
  name: "song",
  components: {
    Avata,
    SongSheet,
    Loading
  },
  data() {
    return {
      params: {
        limit: 10,
        cat: ""
      },
      popover: false,
      songGroupList: [
        {
          icon: "&#xe62c;",
          type: "语种",
          list: []
        },
        {
          icon: "&#xe652;",

          type: "风格",
          list: []
        },
        {
          icon: "&#xe66e; ",

          type: "场景",
          list: []
        },
        {
          icon: "&#xe629;",

          type: "情感",
          list: []
        },
        {
          icon: "&#xe849;",

          type: "主题",
          list: []
        }
      ],
      highquality: {},
      classifyList: [],
      songSheetList: []
    };
  },
  created() {
    if (this.$route.query.tag) {
      this.params.cat = this.$route.query.tag;
    }
    this.getPlaylistHot();
    this.getPlaylistHighquality();
    this.getTopPlaylist();
    this.getPlaylistCatlist();
  },
  methods: {
    handleClick(row) {
      this.params.cat = row.name;
      this.popover = false;
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
      this.songSheetList = [];
      this.$api.songData
        .getTopPlaylist({
          ...this.params
        })
        .then(({ data }) => {
          this.songSheetList = data.playlists;
          // this.classifyList = data.tags;
        });
    },
    getPlaylistCatlist() {
      this.$api.songData.getPlaylistCatlist().then(({ data }) => {
        data.sub.forEach(item => {
          this.songGroupList[item.category].list.push(item);
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
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
<style lang="less">
.m-song-popover {
  width: 700px;
  padding: 0 6px;
  height: 270px;
  overflow-y: auto;
  .m-popover-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    height: 56px;
    line-clamp: 56px;
    border-bottom: 1px solid;
    border-bottom: 1px solid #e5e5e5;
  }
  .m-popover-item {
    display: flex;
    margin-bottom: 40px;
    .m-type {
      width: 100px;
      font-size: 13px;
      color: #cdcdcd;
      .iconfont {
        margin-right: 5px;
        vertical-align: middle;
        font-size: 25px;
        color: #989898;
      }
    }
    ul {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 110px;
        margin-bottom: 10px;
      }
    }
  }
  .m-name {
    display: inline-block;
    padding: 5px 12px;
    text-align: center;
    font-size: 14px;
    color: #555;
    cursor: default;
    &:hover {
      color: #c6382e;
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
</style>
