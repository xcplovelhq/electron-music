<template>
  <div class="g-new-music-list">
    <ul>
      <template v-for="(i, idx) in list">
        <li :key="i.id">
          <div class="m-num">{{ getSum(idx + 1) }}</div>
          <my-image
            :ImgUrl="i.album.picUrl"
            Size="60px"
            IconSize="24px"
            MinWidth="60px"
            Radius="8"
          ></my-image>
          <div class="m-song-name">
            {{ i.name }}
            <span v-if="i.alias && i.alias.length > 0"
              >（{{ i.alias[0] }}）</span
            >
          </div>
          <div class="m-name">
            <router-link
              to=""
              v-for="(v, idx) in i.ar || i.artists"
              :key="v.id"
              >{{ getSongName(v, idx) }}</router-link
            >
          </div>
          <div class="m-album">
            <router-link to="">{{
              (i.al && i.al.name) || (i.album && i.album.name)
            }}</router-link>
          </div>
          <div class="m-time">{{ getTime(i) }}</div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Moment from "moment";
import { getSingerName, getSum } from "@/lib/utils";
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getSongName(item, idx) {
      return getSingerName(item, idx);
    },
    getSum(idx) {
      return getSum(idx);
    },
    getTime(row) {
      return Moment(row.bMusic && row.bMusic.playTime).format("mm:ss");
    }
  }
};
</script>
<style lang="less">
.g-new-music-list {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 35px 10px 30px;
    &:nth-child(2n -1) {
      background: #fafafa;
    }
    .m-num {
      min-width: 25px;
      font-size: 12px;
      color: #cecece;
    }
    .m-song-name {
      // flex: 1;
      margin-left: 10px;
      width: 430px;
      text-align: left;
      font-size: 14px;
      color: #555;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      span {
        color: #999;
      }
    }
    .m-name {
      width: 160px;
      // flex: 1;
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
      width: 200px;
      // flex: 1;
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
      width: 70px;
      text-align: right;
      // flex: 1;
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
