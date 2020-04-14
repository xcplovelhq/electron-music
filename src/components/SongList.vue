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
          <i class="iconfont" v-else @click="handleLike(false, i)">&#xeca1;</i>
          <i class="iconfont i-download">&#xe675;</i>

          <div class="m-song-name">
            <span :class="{ active: getPlayStatus(i) }">{{ i.name }}</span>
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
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Moment from "moment";
import { getStorage } from "@/lib/store";
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
  watch: {
    list() {
      this.info.id = -1;
      this.info.tracks = this.list;
    },
    details() {
      this.info = this.details;
    }
  },
  created() {},
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
    handledbClick(row) {
      this.$store.commit("SET_PLAY_INFO", row);
      if (
        getStorage("playDetails") &&
        getStorage("playDetails").id !== this.info.id
      ) {
        this.getSongUrl({
          id: this.info.tracks.map(item => item.id)
        });
      }
      this.$store.commit("SET_PLAY_DETAILS", this.info);
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
}
</style>
