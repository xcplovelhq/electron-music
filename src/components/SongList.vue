<template>
  <div class="g-song-list">
    <ul>
      <template v-for="(i, idx) in details.tracks || list">
        <li
          :key="i.id"
          @dblclick="handledbClick(i)"
          @click="handleClick(i)"
          :class="{ active: id == i.id }"
        >
          <div class="m-item">
            <div class="m-num">
              <template v-if="getPlayStatus(i)">
                <i class="iconfont" v-if="$store.state.Play.isPlay">&#xe610;</i>
                <i class="iconfont" v-else>&#xe60f;</i>
              </template>
              <template v-else>
                {{ getSum(idx + 1) }}
              </template>
            </div>
            <i
              class="iconfont active"
              v-if="getIsLike(i)"
              @click="handleLike(true, i)"
              >&#xeca2;</i
            >
            <i class="iconfont" v-else @click="handleLike(false, i)"
              >&#xeca1;</i
            >
            <i class="iconfont i-download">&#xe675;</i>

            <div class="m-song-name">
              <span
                :class="{
                  active: getPlayStatus(i),
                  'z-ls': (i.fee == 0 && i.st < 0) || i.fee == 1
                }"
                >{{ i.name }}</span
              >
              <span class="m-text" v-if="i.alia && i.alia.length > 0"
                >（{{ i.alia[0] }}）</span
              >
            </div>
            <div class="m-name" v-if="isShowSinger">
              <router-link
                v-for="(v, idx) in i.ar || i.artists"
                :key="v.id"
                :to="{
                  name: 'singerDetails',
                  query: { id: v.id }
                }"
                >{{ getSongName(v, idx) }}</router-link
              >
            </div>
            <div class="m-album" v-if="isShowAlbum">
              <router-link
                :to="{
                  name: 'songSheetDetails',
                  query: {
                    id: (i.al && i.al.id) || (i.alias && i.alias.id),
                    type: 'album'
                  }
                }"
                >{{
                  (i.al && i.al.name) || (i.album && i.album.name)
                }}</router-link
              >
            </div>
            <div class="m-time">{{ getTime(i) }}</div>
          </div>
          <div
            v-if="i.lyrics"
            class="m-lyric"
            v-html="getDescribe(i.lyrics.txt)"
          ></div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Moment from "moment";
import { mapActions } from "vuex";
export default {
  props: {
    details: {
      type: Object
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default() {
        return "";
      }
    },
    isShowSinger: {
      type: Boolean,
      default: true
    },
    isShowAlbum: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      id: 0,
      info: {}
    };
  },
  created() {
    console.log(this.$route.query.text);
  },
  watch: {
    list() {
      this.info.id = -1;
      this.info.tracks = this.list;
    },
    details() {
      this.info = this.details;
    }
  },
  methods: {
    ...mapActions(["getUserLikelist", "getSongUrl"]),
    getIsLike(row) {
      return (
        this.$store.state.User.likeMusicIds &&
        this.$store.state.User.likeMusicIds.includes(row.id)
      );
    },
    handleClick(row) {
      this.id = row.id;
    },
    getDescribe(v) {
      let text = v.substring(v.indexOf(this.$route.query.text));
      let reg = /[\r\n]/g;
      let rep = new RegExp(this.$route.query.text, "g");
      let resDtring = `<span style='color:#7992B9;'>${this.$route.query.text}</span>`;
      text = text.split("\n");
      text.length = 4;
      text = text.join("\n");
      text = text.replace(rep, resDtring);
      return text && text.replace(reg, "<br />");
    },
    handledbClick(row) {
      let list = [];
      if (row.fee == 0 && row.st < 0) {
        this.$toasted.show("因合作方要求，该资源暂时下架");
        return;
      }
      if (row.fee == 1) {
        this.$toasted.show("版权方要求，当前歌曲仅限开通VIP使用");
        return;
      }
      this.$store.commit("SET_PLAY_INFO", row);
      // 同歌单下不重新获取url，但是网易云的歌曲url有时间限制，故取消
      // if (
      //   getStorage("playDetails") &&
      //   getStorage("playDetails").id !== this.info.id
      // ) {
      //   this.getSongUrl({
      //     id: this.info.tracks.map(item => item.id)
      //   });
      // }SET_PLAY_LIST
      if (this.type !== "search") {
        this.info.tracks.forEach(item => {
          if ((item.fee == 0 && item.st < 0) || item.fee == 1) {
            return;
          } else {
            list.push(item);
          }
        });

        this.getSongUrl({
          id: this.info.tracks.map(item => item.id)
        });
        this.$store.commit("SET_PLAY_LIST", list);
        this.$store.dispatch("getLyric", { id: row.id });
        this.$store.commit("SET_PLAY_DETAILS", this.info);
        this.$store.commit("SET_ISPLAY", true);
      } else {
        this.$store.dispatch("getSongDetails", { ids: row.id });
      }
    },
    handleLike(status, row) {
      this.$api.musicData
        .setLikeMusic({
          id: row.id,
          like: !status
        })
        .then(({ data }) => {
          this.getUserLikelist({ uid: 397132873 }).then(data => {
            console.log(data.ids);

            // this.$store.commit("GET_USER_LIKE_LIST", data.ids);
          });
          console.log(data);
        });
    },
    getPlayStatus(row) {
      if (
        this.$store.state.Play.playInfo &&
        row.id === this.$store.state.Play.playInfo.id
      ) {
        return true;
      } else {
        return false;
      }
    },
    getSongStatus(row) {
      console.log(row);
    },
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    getSum(idx) {
      if (idx < 10) {
        return "0" + idx;
      } else {
        return idx;
      }
    },
    getTime(row) {
      return Moment(row.dt).format("mm:ss");
    }
  }
};
</script>

<style lang="less">
.g-song-list {
  li {
    .m-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 34px;
      padding: 0 5px 0 30px;
      cursor: default;
    }
    &:nth-child(2n -1) {
      background: #fafafa;
    }
    &:hover {
      background: #f2f2f3;
    }
    &.active {
      background: #f0f0f0;
    }
    .iconfont {
      width: 20px;
      font-size: 16px;
      color: #969696;
      cursor: pointer;
      &.active {
        color: #d72b30;
      }
      &.i-download {
        margin: 0 10px;
      }
    }
    .m-num {
      min-width: 30px;
      font-size: 12px;
      color: #cecece;
      .iconfont {
        color: @brand-color;
      }
    }
    .m-song-name {
      flex: 1;
      min-width: 290px;
      text-align: left;
      font-size: 12px;
      color: #444;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      font-size: 12px;
      .m-text {
        font-size: 12px;
        color: #aeaeae;
      }
      .active {
        color: @brand-color;
      }
      .z-ls {
        color: #d0d0d0;
      }
    }
    .m-name {
      min-width: 140px;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      a {
        font-size: 12px;
        color: #717171;
        &:hover {
          color: #444;
        }
      }
    }
    .m-lyric {
      line-height: 1.5;
      padding: 5px 120px 20px;
      font-size: 12px;
    }
    .m-album {
      min-width: 185px;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      a {
        font-size: 12px;
        color: #717171;
        &:hover {
          color: #444;
        }
      }
    }
    .m-time {
      min-width: 70px;
      flex: 1;
      font-size: 12px;
      color: #bdbdbd;
    }
    &.m-title {
      background: #fff;
      .m-num {
        min-width: 84px;
        &:hover {
          background: #fff;
        }
      }
      div {
        height: 100%;
        line-height: 34px;
        font-size: 12px;
        padding-left: 5px;
        color: #a3a3a3;
        cursor: default;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
}
</style>
