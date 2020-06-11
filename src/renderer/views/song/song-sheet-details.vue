<template>
  <div class="g-song-sheet-details">
    <div class="m-song-info">
      <my-image
        class="m-avata"
        :ImgUrl="info.coverImgUrl"
        Size="200px"
        Radius="8"
        v-if="type !== 'album'"
      ></my-image>
      <div v-else class="m-avata-bg">
        <my-image
          class="m-avata"
          :ImgUrl="info.picUrl"
          Size="200px"
          Radius="8"
        ></my-image>
      </div>
      <div class="m-info">
        <div class="m-song-name">
          <span>{{ type == "album" ? "专辑" : "歌单" }}</span
          >{{ info.name }}
        </div>
        <div class="m-name" v-if="type !== 'album'">
          <Avata
            :ImgUrl="info.creator && info.creator.avatarUrl"
            Size="24"
          ></Avata>
          <router-link
            :to="{
              name: 'userDetails',
              query: { id: info.creator && info.creator.userId }
            }"
            >{{ info.creator && info.creator.nickname }}</router-link
          >
          <span>{{ getTime(info.createTime) }}创建</span>
        </div>
        <div class="m-btns">
          <play-btn style="margin-right: 10px"></play-btn>
          <!-- <div class="m-btn">
            <i class="iconfont">&#xe737;</i>播放全部
            <i class="iconfont i-add">&#xe61e;</i>
          </div> -->
          <div class="m-btn">
            <i class="iconfont">&#xe65e;</i>收藏({{
              getSum(
                info.subscribedCount || (info.info && info.info.commentCount)
              )
            }})
          </div>
          <div class="m-btn">
            <i class="iconfont">&#xe60c;</i>分享({{
              info.shareCount || (info.info && info.info.shareCount)
            }})
          </div>
          <div class="m-btn"><i class="iconfont">&#xe675;</i>下载全部</div>
        </div>
        <div class="m-text" v-if="type === 'album'">
          <p>
            歌手：<router-link
              :to="{ name: 'singerDetails', query: { id: item.id } }"
              v-for="(item, idx) in info.artists"
              :key="idx"
              >{{ getSongName(item.name, idx) }}</router-link
            >
          </p>
          <p>时间：{{ getTime(info.publishTime) }}</p>
        </div>
        <div class="m-text" v-else>
          <p>
            标签：<router-link
              :to="{ name: 'songSheet', query: { tag: item } }"
              v-for="(item, idx) in info.tags"
              :key="idx"
              >{{ getSongName(item, idx) }}</router-link
            >
          </p>
          <p>
            歌曲数：<span>{{ info.trackCount }}</span> 播放数：<span>{{
              getSum(info.playCount)
            }}</span>
          </p>
          <p
            class="m-describe"
            :style="{ '-webkit-line-clamp': isMore ? '' : '1' }"
          >
            简介：<span v-html="getDescribe(info.description)"></span>
            <i
              class="iconfont"
              v-if="info.description && info.description.length > 40"
              @click="handleMore"
              >&#xe60a;</i
            >
          </p>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="m-tabs">
      <el-tab-pane label="歌曲列表" name="first">
        <song-box :details="info" :isLoading="isLoading"></song-box>
      </el-tab-pane>
      <el-tab-pane label="评论" name="second">
        <div style="padding:15px 30px">
          <comment-list :type="type"></comment-list>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专辑详情" name="third" v-if="type === 'album'">
        <div class="m-albun-meg">
          <h3>专辑介绍</h3>
          <span v-html="getDescribe(info.description)"></span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收藏者" name="third" v-else
        ><collectors
          style="margin-top: 15px;"
          :list="info.subscribers"
        ></collectors>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Avata from "@/components/Avata";
import SongBox from "./components/song-box";
import Collectors from "./components/collectors";
import PlayBtn from "@/components/PlayBtn";
import Moment from "moment";
import MyImage from "@/components/Image";
import CommentList from "@/components/CommentList";
export default {
  name: "song-sheet-details",
  components: {
    Avata,
    SongBox,
    Collectors,
    PlayBtn,
    MyImage,
    CommentList
  },
  data () {
    return {
      type: "",
      offset: 0,
      activeName: "first",
      isMore: false,
      isLoading: false,
      info: {},
      comment: {}
    };
  },
  created () { },
  activated () {
    this.type = this.$route.query.type;
    if (this.type === "album") {
      this.getAlbum();
    } else {
      this.type = "songSheet";
      this.getPlaylistDetail();
    }
  },
  methods: {
    getTime (time) {
      return Moment(time).format("YYYY-MM-DD");
    },
    getSum (num) {
      if (num > 100000) {
        return (num / 10000).toFixed(0) + "万";
      } else {
        return num;
      }
    },
    getSongName (item, idx) {
      if (idx > 0) {
        return " / " + item || item;
      } else {
        return item;
      }
    },
    getDescribe (v) {
      let reg = /[\r\n]/g;

      return v && v.replace(reg, "<br />");
    },
    handleMore () {
      this.isMore = !this.isMore;

      // return getSum(v);
    },
    getPlaylistDetail () {
      this.isLoading = true;
      this.$api.songData
        .getPlaylistDetail({
          id: this.$route.query.id,
          s: 100
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.info = data.playlist;
          data.privileges.forEach(item => {
            this.info.tracks.forEach(v => {
              if (item.id === v.id) {
                v.st = item.st;
              }
            });
          });
        });
    },
    getAlbum () {
      this.isLoading = true;
      this.$api.albumData
        .getAlbum({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.info = data.album;
          this.info.tracks = data.songs;
        });
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === from.name) {
        this.type = this.$route.query.type;
        if (this.type === "album") {
          this.getAlbum();
        } else {
          this.type = "songSheet";
          this.getPlaylistDetail();
        }
      }

      // 对路由变化作出响应...
    }
  }
};
</script>

<style lang="less" scoped>
.g-song-sheet-details {
  .m-song-info {
    display: flex;
    padding: 14px 30px;
    .m-avata-bg {
      position: relative;
      width: 235px;
      // height: 155px;
      background: url(../../assets/record-bg.png) no-repeat;
      background-size: cover;
    }
    .m-info {
      flex: 1;
      margin-left: 30px;
      a {
        color: #6e99be;
      }
      .m-song-name {
        margin-bottom: 16px;
        font-size: 22px;
        color: #333;
        span {
          margin-right: 10px;
          padding: 0px 5px;
          font-size: 13px;
          color: #eb8a87;
          border: 1px solid #eb8a87;
          border-radius: 3px;
          vertical-align: middle;
        }
      }
      .m-name {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 12px;
        a {
          margin: 0 6px;
        }
        span {
          color: #7e7e7e;
        }
      }
      .m-btns {
        display: flex;
        margin-bottom: 10px;
        .m-btn {
          position: relative;
          margin-right: 10px;
          padding: 0px 12px;
          height: 30px;
          line-height: 28px;
          font-size: 13px;
          color: #444;
          border: 1px solid #d9d9d9;
          border-radius: 50px;
          overflow: hidden;
          cursor: default;
          &:hover {
            background: #f3f3f3;
          }
          .iconfont {
            margin-right: 5px;
            vertical-align: bottom;
          }
          .i-add {
            position: absolute;
            right: 0;
            top: 0px;
            display: block;
            width: 35px;
            height: 30px;
            font-size: 20px;
            text-align: center;
            margin-right: 0;
            border-left: 1px solid rgba(255, 255, 255, 0.3);
            background: @brand-color;
            z-index: 5;
            &:hover {
              background: #ee4a42;
            }
          }
        }
      }
      .m-text {
        font-size: 12px;
        color: #444;
        p {
          position: relative;
          line-height: 30px;
          span {
            color: #7e7e7e;
          }
          &.m-describe {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            span {
            }
            .iconfont {
              position: absolute;
              right: 0;
              top: 0px;
              color: #999;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .m-tabs {
  }
  .m-albun-meg {
    font-size: 12px;
    color: #a8a8a8;
    padding: 10px 30px;
    span {
      line-height: 30px;
    }
    h3 {
      margin-bottom: 10px;
      font-size: 14px;
      color: #333;
    }
  }
}
</style>

<style lang="less">
.g-song-sheet-details {
  .el-tabs__header {
    margin: 0 30px 0px 30px;
  }
}
</style>
