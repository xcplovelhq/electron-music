<template>
  <div class="g-search-box">
    <div v-for="(item, i) in searchList" :key="i">
      <div class="m-title">{{ item.title }}</div>
      <div class="m-tag">
        <el-tag
          v-for="(v, idx) in item.list"
          :key="idx"
          type="info"
          effect="plain"
          :closable="item.closable"
          @click="handleClick(v)"
          @close="handleClose(v, idx)"
        >
          {{ v.first || v }}
        </el-tag>
      </div>
    </div>
    <div
      class="m-search-value"
      :class="{ active: isShowSearch && searchValue }"
      v-if="searchValueInfo.order"
    >
      <div
        v-for="(item, key) in searchValueInfo.order"
        :key="key"
        class="m-items"
      >
        <div class="m-title" v-html="getSearchType(item)"></div>
        <div class="m-item" v-for="v in searchValueInfo[item]" :key="v.id">
          {{ v.name }}
          {{ v.artist && " - " + v.artist.name }}
          <span v-if="v.artists">- </span>
          <span v-for="k in v.artists" :key="k.id">{{ k.name }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowSearch: false,
      searchValueInfo: {},
      searchList: [
        {
          title: "热门搜索",
          list: []
        },
        {
          title: "搜索历史",
          closable: true,
          list: []
        }
      ]
    };
  },
  created() {
    this.getSearchHot();
    this.getSearchHistory();
  },
  computed: {
    searchHistory() {
      return this.$store.state.User.searchHistory;
    },
    searchValue() {
      return this.$store.state.User.search;
    }
  },
  watch: {
    searchValue() {
      this.searchValue &&
        this.$api.userData
          .getSearchSuggest({ keywords: this.searchValue })
          .then(({ data }) => {
            this.searchValueInfo = data.result;
            this.isShowSearch = true;
          });
    }
  },
  methods: {
    getSearchType(type) {
      let text = "";
      switch (type) {
        case "songs":
          text = "<i class='iconfont'>&#xe633;</i>单曲";
          break;
        case "mvs":
          text = "<i class='iconfont'>&#xe670;</i>视频";
          break;
        case "artists":
          text = "<i class='iconfont'>&#xe636;</i>歌手";
          break;
        case "albums":
          text = "<i class='iconfont'>&#xe66f;</i>专辑";
          break;
        case "playlists":
          text = "<i class='iconfont'>&#xe61d;</i>歌单";
          break;
        default:
          break;
      }
      return text;
    },
    getSearchHot() {
      this.$api.userData.getSearchHot().then(({ data }) => {
        this.searchList[0].list = data.result.hots;
      });
    },
    handleClose(row, idx) {
      let arr = this.searchHistory || [];
      arr.splice(idx, 1);
      console.log(arr, idx);
      this.$store.commit("SET_SEARCH_HISTORY", arr);
    },
    handleClick(row) {
      this.$router.push({ name: "search", query: { text: row.first || row } });
      this.$store.commit("SET_SEARCH", row.first || row);
    },
    getSearchHistory() {
      this.searchList[1].list = this.searchHistory;
      console.log(this.searchList[1].list);
    }
  }
};
</script>

<style lang="less" scoped>
.g-search-box {
  .m-title {
  }
}
</style>
<style lang="less">
.g-search-box {
  padding: 20px;
  .m-search-value {
    display: none;
    position: absolute;
    left: 0;
    top: 0px;
    width: 100%;
    height: 100%;
    padding-top: 20px;
    background: #fff;
    &.active {
      animation: opcity 0.3s linear;
      display: block;
    }
  }

  .m-tag {
    margin-top: 20px;
    .el-tag {
      margin: 0 10px 10px 0;
      padding: 0 16px;
      color: #3f3f3f;
      border-radius: 50px;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
  .m-items {
    margin-bottom: 20px;
    .m-title {
      padding: 0 5px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #989898;
      .iconfont {
        font-size: 16px;
        margin-right: 5px;
      }
    }
    .m-item {
      height: 34px;
      padding-left: 25px;
      font-size: 14px;
      line-height: 34px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
@keyframes opcity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
