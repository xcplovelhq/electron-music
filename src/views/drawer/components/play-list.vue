<template>
  <div class="g-play-list">
    <div class="m-list">
      <div class="m-no">
        <h3>你还没有添加任何歌曲</h3>
        <p>去首页<span @click="handleFind">发现音乐</span></p>
      </div>
      <Loading v-if="isLoading"></Loading>
      <ul v-else>
        <template v-for="i in list">
          <li
            :key="i.id"
            @dblclick="handledbClick(i)"
            @click="handleClick(i)"
            :class="{ active: id == i.id }"
          >
            <div class="i-play" v-if="getPlayStatus(i)">
              <i class="iconfont">&#xe618;</i>
            </div>
            <div class="m-song-name">
              <span :class="{ active: getPlayStatus(i) }">{{ i.name }}</span>
              <span class="m-text" v-if="i.alia && i.alia.length > 0"
                >（{{ i.alia[0] }}）</span
              >
            </div>
            <div class="m-name">
              <router-link
                to=""
                v-for="(v, idx) in i.ar || i.artists"
                :key="v.id"
                :class="{ active: getPlayStatus(i) }"
                >{{ getSongName(v, idx) }}</router-link
              >
            </div>
            <div class="m-link">
              <i class="iconfont">&#xe682;</i>
            </div>
            <div class="m-time">{{ getTime(i) }}</div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  data() {
    return {
      isLoading: false,
      id: 0
    };
  },
  computed: {
    list() {
      console.log(this.$store.state.Play.playList);

      return this.$store.state.Play.playList;
    }
  },
  methods: {
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
    handleFind() {
      this.$store.commit("CHANGE_DRAWER_STATUS", false);
      this.$router.push({
        name: "find"
      });
    },
    handleClick(row) {
      this.id = row.id;
    },
    handledbClick(row) {
      this.$store.commit("SET_PLAY_INFO", row);
      this.$store.commit("SET_ISPLAY", true);
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
      console.log(status);
    },
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    getTime(row) {
      return Moment(row.dt).format("mm:ss");
    }
  }
};
</script>

<style lang="less">
.g-play-list {
  height: 100%;

  .m-list {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
  .m-no {
    padding: 100px 0 0 130px;
    h3 {
      font-size: 16px;
      color: #b0b0b0;
    }
    p {
      margin-top: 20px;
      font-size: 14px;
      color: #b0b0b0;
      span {
        text-decoration: underline;
        color: #444;
        &:hover {
          color: #000;
        }
      }
    }
  }
  li {
    position: relative;
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
      width: 15px;
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
    .m-link {
      margin: 0 15px;
    }
    .i-play {
      position: absolute;
      left: 15px;
      top: 3px;
      .iconfont {
        font-size: 8px;
        color: @brand-color;
      }
    }
    .m-song-name {
      width: 185px;
      margin-right: 5px;
      text-align: left;
      font-size: 12px;
      color: #444;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      font-size: 12px;
      color: #858585;
      .m-text {
        font-size: 12px;
        color: #858585;
      }
      .active {
        color: @brand-color;
      }
    }
    .m-name {
      width: 85px;
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
        &.active {
          color: @brand-color;
        }
      }
    }
    .m-time {
      flex: 1;
      font-size: 12px;
      color: #bdbdbd;
    }
    &.m-title {
      background: #fff;
      .m-num {
        min-width: 70px;
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
