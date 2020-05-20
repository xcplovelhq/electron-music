<template>
  <div class="g-mv">
    <div class="g-warper">
      <div class="m-nav">
        <g-title
          title="最新MV"
          style="margin-bottom: 0"
          :to="{ name: 'mvAll', query: { area: '内地', order: '最新' } }"
        ></g-title>
        <div class="m-classify">
          <ul>
            <template v-for="item in mvGroup">
              <li :key="item">
                <div
                  class="m-name"
                  :class="{ active: newMvGroupValue === item }"
                  @click="handleClick(item)"
                >
                  {{ item }}
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <Loading v-if="newMvList && newMvList.length <= 0"></Loading>
      <mv-list v-else :list="newMvList" type="mv"></mv-list>
      <g-title
        title="热播MV"
        :to="{ name: 'mvAll', query: { area: '', order: '最热' } }"
      ></g-title>
      <mv-list :list="hotMvList" type="mv"></mv-list>
      <g-title
        title="网易出品MV"
        :to="{
          name: 'mvAll',
          query: { area: '', type: '网易出品', order: '最新' }
        }"
      ></g-title>
      <mv-list :list="wycpMvList" type="mv"></mv-list>
      <div class="m-nav">
        <g-title title="MV排行榜" :to="{ name: 'mvRankAll' }"></g-title>
        <div class="m-classify">
          <ul>
            <template v-for="item in mvGroup">
              <li :key="item">
                <div
                  class="m-name"
                  :class="{ active: newMvRankValue === item }"
                  @click="handleClick(item, 'rank')"
                >
                  {{ item }}
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <mv-rank :list="mvRank"></mv-rank>
    </div>
  </div>
</template>

<script>
import MvList from "./components/mv-list";
import MvRank from "./components/mv-rank";
import Loading from "@/components/Loading";
import GTitle from "@/components/Title";

export default {
  components: {
    MvList,
    Loading,
    GTitle,
    MvRank
  },
  data() {
    return {
      popover: false,
      newMvGroupValue: "内地",
      newMvRankValue: "内地",
      newMvList: [],
      hotMvList: [],
      wycpMvList: [],
      mvRank: []
    };
  },
  created() {
    this.getMvFirst();
    this.getPersonalizedMv();
    this.getMvExclusiveRcmd();
    this.getTopMv();
  },
  computed: {
    mvGroup() {
      return this.$store.state.mvArea;
    }
  },
  methods: {
    handleClick(row, type) {
      if (type === "rank") {
        this.newMvRankValue = row;
        this.getTopMv();
      } else {
        this.newMvGroupValue = row;
        this.getMvFirst();
      }
    },
    getMvFirst() {
      this.newMvList = [];
      this.$api.videoData
        .getMvFirst({
          area: this.newMvGroupValue,
          limit: 6
        })
        .then(({ data }) => {
          this.newMvList = data.data;
        });
    },
    getPersonalizedMv() {
      this.hotMvList = [];
      this.$api.videoData.getPersonalizedMv().then(({ data }) => {
        data.result.forEach(item => {
          this.hotMvList.push({
            cover: item.picUrl,
            playCount: item.playCount,
            id: item.id,
            name: item.name
          });
        });
        // this.hotMvList = data.result;
      });
    },
    getMvExclusiveRcmd() {
      this.wycpMvList = [];
      this.$api.videoData
        .getMvExclusiveRcmd({
          limit: 6
        })
        .then(({ data }) => {
          this.wycpMvList = data.data;
        });
    },
    getTopMv() {
      this.$api.videoData
        .getTopMv({
          area: this.newMvRankValue,
          limit: 10
        })
        .then(({ data }) => {
          this.mvRank = data.data;
        });
    }
  }
};
</script>
<style lang="less">
.g-mv {
  .g-warper {
    padding: 15px 30px;
  }
  .m-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 0;
  }

  .m-btn {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 13px;
    color: #444;
    border: 1px solid #d9d9d9;
    border-radius: 50px;
    cursor: default;
    &:hover {
      background: #f3f3f3;
    }
    .iconfont {
      font-size: 12px;
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
</style>
