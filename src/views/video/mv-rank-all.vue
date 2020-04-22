<template>
  <div class="g-mv-rank-all">
    <div class="g-warper">
      <div class="m-nav">
        <div class="m-tips">
          最近更新：{{ $moment(time).format("YYYY-MM-DD") }}
          <el-popover placement="top-start" width="200" trigger="hover">
            <p style="font-size: 12px; color: #777; margin-bottom: 10px;">
              选取云音乐中3个月内发布的热度最高的50支MV，每天更新。
            </p>
            <p style="font-size: 12px; color: #777;">
              热度由MV播放、收藏、分享数量总和计算
            </p>
            <i class="iconfont" slot="reference">&#xe63b;</i>
          </el-popover>
        </div>
        <div class="m-classify">
          <ul>
            <template v-for="item in mvGroup">
              <li :key="item">
                <div
                  class="m-name"
                  :class="{ active: newMvRankValue === item }"
                  @click="handleClick(item)"
                >
                  {{ item }}
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <Loading v-if="mvRank && mvRank.length <= 0"></Loading>
      <mv-rank :list="mvRank"></mv-rank>
    </div>
  </div>
</template>

<script>
import MvRank from "./components/mv-rank";
import Loading from "@/components/Loading";

export default {
  components: {
    MvRank,
    Loading
  },
  data () {
    return {
      time: "",
      a: true,
      mvRank: [],
      newMvRankValue: "内地"
    };
  },
  computed: {
    mvGroup () {
      return this.$store.state.mvArea;
    }
  },
  created () {
    this.getTopMv();
  },
  methods: {
    handleClick (row) {
      this.newMvRankValue = row;
      this.getTopMv();
    },
    getTopMv () {
      this.mvRank = [];
      this.$api.videoData
        .getTopMv({
          area: this.newMvRankValue
        })
        .then(({ data }) => {
          this.mvRank = data.data;
          this.time = data.updateTime;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-mv-rank-all {
  .g-warper {
    padding: 15px 30px;
  }
  .m-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 0;
    .m-tips {
      font-size: 12px;
      color: #999;
      p {
        margin-bottom: 5px;
        font-size: 12px;
        color: #777;
      }
      .iconfont {
        vertical-align: middle;
      }
    }
    .m-classify {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          border-right: 1px solid #f6f6f6;
        }
      }
    }
    .m-name {
      cursor: default;
      margin: 0 5px;
      padding: 0 9px;
      text-align: center;
      font-size: 12px;
      color: #858585;
      &:hover {
        color: #444;
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
}
</style>
