<template>
  <div class="g-album-list">
    <div class="m-big-picture">
      <ul v-infinite-scroll="load">
        <router-link
          v-for="item in list"
          :key="item.id"
          tag="li"
          :to="{
            name: 'songSheetDetails',
            query: { id: item.id, type: 'album' }
          }"
        >
          <div class="m-avata-bg">
            <my-image
              :ImgUrl="item.picUrl"
              IconSize="40px"
              Size="85%"
              Radius="8"
              :isHover="true"
            ></my-image>
          </div>

          <div class="m-info">
            <h3>
              {{ item.name
              }}<span v-if="item.alias && item.alias.length > 0"
                >（{{ item.alias[0] }}）</span
              >
            </h3>
            <p>{{ getTime(item.publishTime) }}</p>
          </div>
        </router-link>
      </ul>
    </div>
    <div class="m-list-model">
      <ul v-infinite-scroll="load">
        <template v-for="item in list">
          <li :key="item.id">
            <my-image
              :ImgUrl="item.picUrl"
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
            <div class="m-size">{{ item.size }}首</div>
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

export default {
  components: {
    MyImage
  },
  data() {
    return {
      isLoading: false,
      list: [],
      limit: 10
    };
  },
  created() {
    this.getArtistAlbum();
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
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getArtistAlbum();
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
    }
  }
};
</script>

<style lang="less">
.g-album-list {
  .m-big-picture {
    padding: 0 30px;
    ul {
      display: grid;
      // flex-wrap: wrap;
      justify-content: space-between;
      grid-row-gap: 10px;
      grid-column-gap: 10px;
      grid-template-columns: repeat(auto-fill, 18%);
      li {
        width: 100%;
        margin-bottom: 20px;
        cursor: pointer;
        &:last-child {
          margin-right: auto;
        }
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
  .m-avata-bg {
    position: relative;
    // width: 183px;
    // height: 155px;
    background: url(../assets/record-bg.png) no-repeat;
    background-size: cover;
  }
}
</style>
