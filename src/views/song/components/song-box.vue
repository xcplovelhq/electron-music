<template>
  <div class="g-song-box">
    <ul>
      <li class="m-title">
        <div class="m-num"></div>
        <div class="m-song-name">音乐标题</div>
        <div class="m-name">歌手</div>
        <div class="m-album">专辑</div>
        <div class="m-time">时长</div>
      </li>
    </ul>
    <Loading v-if="isLoading"></Loading>
    <song-list :list="list" :details="details"></song-list>
  </div>
</template>

<script>
// import Moment from "moment";
import Loading from "@/components/Loading";
// import { getStorage } from "@/lib/store";
import { mapActions } from "vuex";
import SongList from "@/components/SongList";

export default {
  components: {
    Loading,
    SongList
  },
  props: {
    details: {
      type: Object,
      default () {
        return {};
      }
    },
    list: {
      type: Array,
      default () {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: 0
    };
  },
  created () { },
  methods: {
    ...mapActions(["getUserLikelist", "getSongUrl"])
    // getIsLike (row) {
    //   return (
    //     this.$store.state.User.likeMusicIds &&
    //     this.$store.state.User.likeMusicIds.includes(row.id)
    //   );
    // },
    // handleClick (row) {
    //   this.id = row.id;
    // },
    // handledbClick (row) {
    //   this.$store.commit("SET_PLAY_INFO", row);
    //   if (
    //     getStorage("playDetails") &&
    //     getStorage("playDetails").id !== this.details.id
    //   ) {
    //     this.getSongUrl({
    //       id: this.details.tracks.map(item => item.id)
    //     });
    //   }
    //   this.$store.commit("SET_PLAY_DETAILS", this.details);
    //   this.$store.commit("SET_ISPLAY", true);
    // },
    // handleLike (status, row) {
    //   this.$api.musicData
    //     .setLikeMusic({
    //       id: row.id,
    //       like: !status
    //     })
    //     .then(({ data }) => {
    //       this.getUserLikelist({ uid: 397132873 }).then(data => {
    //         console.log(data.ids);

    //         // this.$store.commit("GET_USER_LIKE_LIST", data.ids);
    //       });
    //       console.log(data);
    //     });
    //   console.log(status);
    // },
    // getPlayStatus (row) {
    //   if (
    //     this.$store.state.Play.playInfo &&
    //     row.id === this.$store.state.Play.playInfo.id
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // getSongName (item, idx) {
    //   if (idx > 0) {
    //     return " / " + item.name;
    //   } else {
    //     return item.name;
    //   }
    // },
    // getSum (idx) {
    //   if (idx < 10) {
    //     return "0" + idx;
    //   } else {
    //     return idx;
    //   }
    // },
    // getTime (row) {
    //   return Moment(row.dt).format("mm:ss");
    // }
  }
};
</script>

<style lang="less">
.g-song-box {
  border-top: 1px solid #e5e5e5;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 34px;
    padding: 0 5px 0 30px;
    cursor: default;
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
