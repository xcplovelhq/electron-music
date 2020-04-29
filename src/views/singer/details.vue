<template>
  <div class="g-singer-details">
    <div class="m-song-info">
      <div>
        <my-image
          class="m-avata"
          :ImgUrl="info.picUrl"
          Size="200px"
          Radius="8"
        ></my-image>
      </div>
      <div class="m-info">
        <div class="m-song-name">
          {{ info.name }}
        </div>
        <div class="m-btns">
          <div class="m-btn">
            <i class="iconfont">&#xe65e;</i>收藏({{
              getSum(
                info.subscribedCount || (info.info && info.info.commentCount)
              )
            }})
          </div>
          <div class="m-btn"><i class="iconfont">&#xe675;</i>个人主页</div>
        </div>
        <div class="m-text">
          <p>
            单曲数：<span>{{ info.musicSize }}</span> 专辑数：<span>{{
              info.albumSize
            }}</span>
            MV数：<span>{{ info.mvSize }}</span>
          </p>
        </div>
      </div>
    </div>
    <div style="position:relative" v-if="activeName === 'first'">
      <div class="m-type">
        <div :class="{ active: isType == 0 }" @click="isType = 0">
          <i class="iconfont">&#xe849;</i>
        </div>
        <div :class="{ active: isType == 1 }" @click="isType = 1">
          <i class="iconfont">&#xe859;</i>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="m-tabs">
      <el-tab-pane label="专辑" name="first">
        <type-list :type="isType" v-if="activeName === 'first'"></type-list>
      </el-tab-pane>
      <el-tab-pane label="MV" name="second">
        <div class="m-no" v-if="mvList && mvList.length <= 0">没有相关MV</div>
        <div>
          <mv-list
            :list="mvList"
            v-if="activeName === 'second'"
            style="padding: 0 30px"
          ></mv-list>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌手详情" name="third">
        <div class="m-albun-meg" v-for="item in desc" :key="item.ti">
          <h3>{{ item.ti }}</h3>
          <span v-html="getDescribe(item.txt)"></span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="four">
        <singer-list></singer-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MyImage from "@/components/Image";
import TypeList from "@/components/TypeList";
import MvList from "./components/mv-list";
import SingerList from "./components/singer-list";

export default {
  components: {
    MyImage,
    TypeList,
    MvList,
    SingerList
  },
  data() {
    return {
      isType: 0,
      activeName: "first",
      isLoading: false,
      limit: 20,
      info: {},
      desc: [],
      singerList: [],
      mvList: []
    };
  },
  created() {
    this.getSingerDetail();
  },
  methods: {
    getSum(num) {
      if (num > 100000) {
        return (num / 10000).toFixed(0) + "万";
      } else {
        return num;
      }
    },
    getDescribe(v) {
      let reg = /[\r\n]/g;

      return v && v.replace(reg, "<br />");
    },
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getArtistMv();
    },
    getSingerDetail() {
      this.isLoading = true;
      this.$api.singerData
        .getArtists({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.info = data.artist;
          this.getArtistDesc();
        });
    },
    getArtistDesc() {
      this.$api.singerData
        .getArtistDesc({
          id: this.$route.query.id
        })
        .then(({ data }) => {
          this.isLoading = false;
          console.log(this.info);

          this.desc = data.introduction;
          this.desc.unshift({
            ti: this.info.name + "简介",
            txt: data.briefDesc
          });
        });
    }
  }
};
</script>

<style lang="less">
.g-singer-details {
  .m-no {
    padding-top: 50px;
    width: 100%;
    text-align: center;
  }
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
            margin-right: 20px;
          }
        }
      }
    }
  }
  .m-type {
    display: flex;
    position: absolute;
    right: 30px;
    top: 0;
    z-index: 1000;
    div {
      width: 25px;
      height: 20px;
      line-height: 18px;
      text-align: center;
      background: #f3f3f3;
      margin-right: 1px;
      cursor: default;
      &:hover {
        background: #e8e8e8;
      }
      &.active {
        background: #c0c0c0;
        .iconfont {
          color: #fff;
        }
      }
      .iconfont {
        font-size: 14px;
        color: #919191;
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
  .el-tabs__item {
    color: #555;
    &:hover {
      color: #222;
    }
  }
  .el-tabs__header {
    margin: 0 30px 15px 30px;
  }
  .el-tabs__item.is-active {
    color: @brand-color;
  }
  .el-tabs__active-bar {
    background: @brand-color;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background: #f3f3f3;
  }
}
</style>
