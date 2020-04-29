<template>
  <div class="g-type-list">
    <div class="m-big-picture" v-if="type == 0">
      <Loading v-if="isLoading"></Loading>
      <ul
        v-infinite-scroll="load"
        infinite-scroll-immediate
        :infinite-scroll-distance="20"
      >
        <router-link
          v-for="item in list"
          :key="item.id"
          tag="li"
          :to="{
            name: 'songSheetDetails',
            query: { id: item.id, type: dataType === 'user' ? '' : 'album' }
          }"
        >
          <div class="m-song-img">
            <my-image
              v-if="dataType !== 'user'"
              :ImgUrl="item.picUrl || item.coverImgUrl"
              IconSize="40px"
              Size="100%"
              Radius="8"
              :isHover="true"
            ></my-image>
            <my-image
              v-else
              :ImgUrl="item.picUrl || item.coverImgUrl"
              Size="100%"
              Radius="8"
            ></my-image>
          </div>

          <div class="m-info">
            <h3>
              {{ item.name
              }}<span v-if="item.alias && item.alias.length > 0"
                >（{{ item.alias[0] }}）</span
              >
            </h3>
            <p>{{ item.trackCount + "首" || getTime(item.publishTime) }}</p>
          </div>
        </router-link>
      </ul>
    </div>
    <div class="m-list-model" v-else-if="type == 1">
      <Loading v-if="isLoading"></Loading>
      <ul
        v-infinite-scroll="modelLoad"
        infinite-scroll-immediate
        :infinite-scroll-distance="20"
      >
        <template v-for="item in list">
          <li :key="item.id">
            <my-image
              :ImgUrl="item.picUrl || item.coverImgUrl"
              Size="60px"
              IconSize="24px"
              MinWidth="60px"
              Radius="8"
            ></my-image>
            <div class="m-song-name" @click="handleClick(item)">
              {{ item.name }}
              <span v-if="item.alias && item.alias.length > 0"
                >（{{ item.alias[0] }}）</span
              >
            </div>
            <div class="m-size">{{ item.size || item.trackCount }}首</div>
            <div class="m-time">发行时间：{{ getTime(item.publishTime) }}</div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import MyImage from "@/components/Image";
import Loading from "@/components/Loading";

export default {
  props: {
    type: [String, Number],
    dataType: String
  },
  components: {
    MyImage,
    Loading
  },
  data() {
    return {
      isLoading: false,
      list: [],
      limit: 10
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getTime(time) {
      return Moment(time).format("YYYY-MM-DD");
    },
    handleClick(row) {
      this.$router.push({
        name: "songSheetDetails",
        query: { id: row.id, type: "album" }
      });
    },
    modelLoad() {},
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getData();
    },
    getUserPlaylist() {
      this.isLoading = true;
      this.$api.userData
        .getUserPlaylist({
          uid: this.$route.query.id,
          limit: this.limit
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.list = data.playlist;
        });
    },
    getArtistAlbum() {
      this.isLoading = true;
      this.$api.singerData
        .getArtistAlbum({
          id: this.$route.query.id,
          limit: this.limit
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.list = data.hotAlbums;
        });
    },
    getData() {
      if (this.dataType === "user") {
        this.getUserPlaylist();
      } else {
        this.getArtistAlbum();
      }
    }
  },
  watch: {
    type() {
      this.list = [];
      this.limit = 10;
      this.getData();
    }
  }
};
</script>

<style lang="less">
.g-type-list {
  .m-big-picture {
    padding: 0 30px;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 18%;
        &:not(:nth-child(5n)) {
          margin-right: calc(10% / 4);
        }
        // width: 100%;
        margin-bottom: 20px;
        cursor: pointer;
        // &:last-child {
        //   margin-right: auto;
        // }
        .m-info {
          margin-top: 5px;
          h3 {
            cursor: pointer;
            font-size: 13px;
            color: #444;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            span {
              color: #a6a6a6;
            }
            &:hover {
              color: #000;
            }
          }
          p {
            font-size: 12px;
            color: #c9c9c9;
          }
        }
      }
    }
  }
  .m-list-model {
    ul {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 35px 10px 30px;
        &:nth-child(2n) {
          background: #fafafa;
        }
        &:hover {
          background: #f2f2f3;
        }
        .m-song-name {
          flex: 1;
          margin-left: 10px;
          text-align: left;
          font-size: 14px;
          color: #555;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          cursor: pointer;
          span {
            color: #999;
          }
        }
        .m-size {
          width: 7%;
          font-size: 14px;
          color: #bfbfbf;
        }
        .m-time {
          width: 190px;
          text-align: right;
          font-size: 14px;
          color: #c9c9c9;
        }
      }
    }
  }
  .m-tuglie {
  }
  .m-song-img {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
}
</style>
