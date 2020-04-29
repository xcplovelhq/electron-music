<template>
  <div class="g-boutique-song">
    <div class="m-warper">
      <div class="m-header">
        <div class="m-tips">
          精品歌单
        </div>
        <div class="m-screen">
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
                  :class="{ active: cat === '' }"
                  @click="handleScreen('')"
                >
                  全部歌单
                </div>
              </div>
              <div class="m-popover-item">
                <ul>
                  <li v-for="v in songGroupList" :key="v.name">
                    <div
                      class="m-name"
                      :class="{ active: cat === v.name }"
                      @click="handleScreen(v)"
                    >
                      {{ v.name }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="m-btn" slot="reference">
              <i class="iconfont">&#xe656;</i>{{ cat || "筛选" }}
            </div>
          </el-popover>
        </div>
      </div>
      <div class="m-list">
        <Loading v-if="isLoading"></Loading>
        <ul
          v-infinite-scroll="load"
          infinite-scroll-immediate
          :infinite-scroll-distance="20"
        >
          <li v-for="item in list" :key="item.id">
            <div class="m-img" @click="handleClick(item, 'song')">
              <my-image
                :ImgUrl="item.coverImgUrl"
                Size="100%"
                Radius="8"
              ></my-image>
              <div class="m-play-num">
                <i class="iconfont">&#xe607;</i>{{ getSum(item.playCount) }}
              </div>
              <div class="m-tips">
                <i class="iconfont">&#xe655;</i>
              </div>
            </div>
            <div class="m-info">
              <div class="m-song" @click="handleClick(item, 'song')">
                {{ item.name }}
              </div>
              <div class="m-name" @click="handleClick(item, 'singer')">
                <span>by {{ item.creator.nickname }}</span
                ><i class="iconfont" v-if="!!item.creator.experts">&#xe614;</i>
              </div>
              <div class="m-type">
                <span>{{ item.tag }}</span
                >{{ item.copywriter }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MyImage from "@/components/Image";
import Loading from "@/components/Loading";

export default {
  components: {
    MyImage,
    Loading
  },
  data() {
    return {
      popover: false,
      songGroupList: [],
      list: [],
      cat: "",
      limit: 20,
      isLoading: false
    };
  },
  created() {
    this.cat = this.$route.query.cat;
    this.getData();
    this.getPlaylistCatlist();
  },
  methods: {
    getSum(num) {
      if (num > 100000) {
        return (num / 10000).toFixed(0) + "万";
      } else {
        return num;
      }
    },
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getData();
    },
    handleScreen(row) {
      this.cat = row.name;
      this.popover = false;
      this.getData();
    },
    handleClick(row, type) {
      if (type === "song") {
        this.$router.push({ name: "songSheetDetails", query: { id: row.id } });
      } else {
        this.$router.push({
          name: "userDetails",
          query: { id: row.creator.userId }
        });
      }
    },
    getData() {
      this.list = [];
      this.isLoading = true;
      this.$api.songData
        .getPlaylistHighquality({
          cat: this.cat,
          limit: this.limit
        })
        .then(({ data }) => {
          this.list = data.playlists;
          this.isLoading = false;
        });
    },
    getPlaylistCatlist() {
      this.isLoading = true;
      this.$api.songData.getPlaylistCatlist().then(({ data }) => {
        data.sub.forEach(item => {
          if (item.category == 0 || item.category == 1) {
            this.songGroupList.push(item);
          }
        });
        // this.songGroupList = data.sub;
        this.isLoading = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.g-boutique-song {
  .m-warper {
    padding: 20px 30px;
  }
  .m-header {
    display: flex;
    justify-content: space-between;
    .m-tips {
      font-size: 16px;
      color: #333;
    }
    .m-btn {
      padding: 2px 15px;
      font-size: 13px;
      color: #444;
      border: 1px solid #d9d9d9;
      border-radius: 50px;
      cursor: default;
      &:hover {
        background: #f3f3f3;
      }
      .iconfont {
        font-size: 13px;
      }
    }
  }
  .m-list {
    margin-top: 10px;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        width: 350px;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 20px;
        .m-img {
          position: relative;
          width: 134px;
          height: 134px;
          cursor: pointer;
          .m-play-num {
            position: absolute;
            right: 0px;
            top: 0px;
            padding-top: 5px;
            padding-right: 7px;
            width: 100%;
            font-size: 12px;
            color: #fff;
            text-align: right;
            z-index: 100;
            background: linear-gradient(
              rgba(0, 0, 0, 0.3),
              rgba(129, 118, 118, 0)
            );
            .iconfont {
              font-size: 12px;
              margin-right: 3px;
            }
          }
        }
        .m-info {
          flex: 1;
          margin-left: 10px;
        }
        .m-song {
          font-size: 14px;
          color: #555;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          cursor: pointer;
          &:hover {
            color: #000;
          }
        }
        .m-tips {
          position: absolute;
          left: 0;
          top: 0;
          border-top: 15px solid #fab06f;
          border-left: 15px solid #fab06f;
          border-bottom: 15px solid transparent;
          border-right: 15px solid transparent;
          z-index: 100;
          .iconfont {
            position: absolute;
            left: -13px;
            top: -12px;
            font-size: 14px;
            color: #fff;
            z-index: 100;
            transform: rotate(-50deg);
          }
        }
        .m-name {
          margin-top: 10px;
          font-size: 12px;
          color: #989898;
          span:hover {
            cursor: pointer;
            color: #333;
          }
          .iconfont {
            margin-left: 5px;
            font-size: 12px;
            color: #ffbd3b;
          }
        }
        .m-type {
          margin-top: 26px;
          font-size: 12px;
          color: #c9c9c9;
          span {
            margin-right: 5px;
            padding: 0 2px;
            border: 1px solid #ce8884;
            color: #ce8884;
            font-size: 10px;
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
    margin-bottom: 40px;
    ul {
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
