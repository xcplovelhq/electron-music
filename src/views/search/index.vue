<template>
  <div class="g-search-details">
    <div class="m-title">
      {{ title }}<span v-if="count > 0">找到{{ count }}{{ getType() }}</span>
    </div>
    <el-tabs v-model="activeName" class="m-tabs" @tab-click="handleTab">
      <el-tab-pane
        :label="item.label"
        :name="item.name"
        v-for="item in tabList"
        :key="item.name"
        class="m-list"
      >
        <Loading v-if="loading"></Loading>

        <song-box
          v-if="
            !loading && activeName == item.name && item.components === 'music'
          "
          :list="list"
          :type="item.type"
          :isLoading="isLoading"
        ></song-box>
        <list
          :list="list"
          :type="item.type"
          v-if="activeName == item.name && item.components === 'list'"
        ></list>
        <div
          style="padding: 20px 30px"
          v-if="activeName == item.name && item.components === 'video'"
        >
          <mv-list :list="list" type="video"></mv-list>
        </div>
        <div class="m-pagination" v-if="list && list.length > 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="offset"
            :page-size="limit"
            :total="count"
            @current-change="handleChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="歌手" name="100">
          <list :list="list" v-if="activeName == 100"></list>
        </el-tab-pane>
        <el-tab-pane label="专辑" name="10"> </el-tab-pane>
        <el-tab-pane label="视频" name="1014"> </el-tab-pane>
        <el-tab-pane label="歌单" name="1000"> </el-tab-pane>
        <el-tab-pane label="歌词" name="1006"> </el-tab-pane>
         <el-tab-pane label="主播电台" name="third"> </el-tab-pane>
        <el-tab-pane label="用户" name="1002"> </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import SongBox from "@/views/song/components/song-box";
import List from "./components/list";
import MvList from "@/views/video/components/mv-list";
import Loading from "@/components/Loading";

export default {
  components: {
    SongBox,
    List,
    MvList,
    Loading
  },
  data() {
    return {
      limit: 100,
      offset: 0,
      activeName: "1",
      title: "",
      count: 0,
      type: 1,
      list: [],
      loading: false,
      isLoading: false,
      tabList: [
        {
          name: "1",
          label: "单曲",
          type: "search",
          components: "music"
        },
        {
          name: "100",
          label: "歌手",
          components: "list",
          type: "singer"
        },
        {
          name: "10",
          label: "专辑",
          components: "list",
          type: "ablums"
        },
        {
          name: "1014",
          label: "视频",
          type: "video",
          components: "video"
        },
        {
          name: "1000",
          label: "歌单",
          components: "list",
          type: "song"
        },
        {
          name: "1006",
          label: "歌词",
          components: "music",
          type: "search"
        },
        {
          name: "1002",
          label: "用户",
          components: "list",
          type: "user"
        }
      ]
    };
  },
  created() {
    this.title = this.$route.query.text;
    this.getData(1);
  },
  methods: {
    getType() {
      let text = "";
      switch (this.type) {
        case 1:
          text = "首单曲";
          break;
        case 100:
          text = "位歌手";
          break;
        case 10:
          text = "张专辑";
          break;
        case 1014:
          text = "个视频";
          break;
        case 1000:
          text = "个歌单";
          break;
        case 1006:
          text = "首歌词";
          break;
        // case 1009:
        //   text = "个电台";
        //   break;
        case 1002:
          text = "位用户";
          break;
        default:
          break;
      }
      return text;
    },
    handleTab() {
      this.list = [];
      this.offset = 1;
      this.count = 0;
      this.type = +this.activeName;
      if (this.activeName == 1) {
        this.limit = 100;
      } else {
        this.limit = 20;
      }
      this.getData(1);
    },
    handleChange(row) {
      this.offset = row;
      this.getData(row);
    },
    getData(offset) {
      this.list = [];
      this.loading = true;
      this.$api.userData
        .search({
          keywords: this.title,
          type: this.type,
          limit: this.limit,
          offset: offset - 1
        })
        .then(({ data }) => {
          this.loading = false;

          switch (this.type) {
            case 1:
              this.list = data.result.songs;
              this.count = data.result.songCount;
              break;
            case 100:
              this.list = data.result.artists;
              this.count = data.result.artistCount;
              break;
            case 10:
              this.list = data.result.albums;
              this.count = data.result.albumCount;
              break;
            case 1014:
              this.list = data.result.videos;
              this.count = data.result.videoCount;
              break;
            case 1000:
              this.list = data.result.playlists;
              this.count = data.result.playlistCount;
              break;
            case 1006:
              this.list = data.result.songs;
              this.count = data.result.songCount;
              break;
            case 1002:
              this.list = data.result.userprofiles;
              this.count = data.result.userprofileCount;
              break;
            default:
              break;
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-search-details {
  height: 100%;
  padding-bottom: 20px;
  .m-title {
    padding: 20px;
    font-size: 20px;
    color: #333;
    font-weight: 500;
    span {
      margin-left: 5px;
      font-size: 13px;
      color: #888;
    }
  }
  .m-pagination {
    text-align: center;
    margin-top: 40px;
  }
  .m-list {
    height: 100%;
    padding-bottom: 20px;

    overflow-y: auto;
  }
}
</style>
<style lang="less">
.g-search-details {
  .el-tabs__header {
    padding: 0 20px 0px 20px;
  }
  .el-tabs__header {
    margin: 0;
  }
  .m-tabs {
    height: calc(100% - 50px);
  }
  .el-tabs__content {
    height: calc(100% - 36px);
    overflow-y: auto;
  }
}
</style>
