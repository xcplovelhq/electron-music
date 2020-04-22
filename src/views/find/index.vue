<template>
  <div class="g-find ">
    <div class="g-warper">
      <div class="g-banner">
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in bannerList" :key="item.key">
            <el-image
              class="m-banner-img"
              :src="item.imageUrl"
              fit="fill"
            ></el-image>
            <div class="m-tips">{{ item.typeTitle }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <template v-for="item in columnList">
        <g-title :title="item.title" :key="item.title"></g-title>
        <div :key="item.type">
          <song-sheet
            :list="songSheetList"
            type="recommend"
            v-if="item.type === 'song'"
          ></song-sheet>
          <new-music
            :list="newSongList"
            v-else-if="item.type === 'music'"
          ></new-music>
          <video-list
            :list="videoList"
            v-else-if="item.type === 'mv'"
          ></video-list>
        </div>
      </template>
      <div class="m-change">
        <p>现在可以根据个人喜好，自有调整首页栏目顺序啦</p>
        <div class="m-btn" @click="handleDialog">调整栏目顺序</div>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      title="调整栏目顺序"
      center
      :modal="false"
      :visible.sync="visible"
      width="330px"
      class="m-column-dialog"
    >
      <div class="m-title">想调整首页栏目的顺序？按住右边的按钮拖动即可</div>
      <draggable v-model="columnList" v-bind="dragOptions">
        <transition-group type="transition" name="flip-list">
          <div
            class="m-column-item"
            v-for="(item, idx) in columnList"
            :key="idx"
          >
            <div>
              {{ item.title }}
            </div>
          </div>
        </transition-group>
      </draggable>
      <div class="m-reset" @click="handleReset">回复默认排序</div>
    </el-dialog>
  </div>
</template>

<script>
import GTitle from "@/components/Title";
import SongSheet from "@/components/SongSheet";
import NewMusic from "./components/new-music";
import VideoList from "@/components/VideoList";
import draggable from "vuedraggable";
export default {
  components: {
    GTitle,
    SongSheet,
    NewMusic,
    VideoList,
    draggable
  },
  display: "Transition",
  data() {
    return {
      visible: false,
      columnList: [
        {
          id: 1,
          title: "推荐歌单",
          type: "song"
        },
        {
          id: 2,
          title: "最新音乐",
          type: "music"
        },
        {
          id: 3,
          title: "推荐MV",
          type: "mv"
        }
      ],
      bannerList: [],
      songSheetList: [],
      newSongList: [],
      videoList: [],
      djList: []
    };
  },
  created() {
    this.getBanner();
    this.getPersonalized();
    this.getRecommendResource();
    this.getPersonalizedNewsong();
    this.getPersonalizedMv();
    this.getPersonalizedDjprogram();
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    handleDialog() {
      this.visible = true;
    },
    handleReset() {
      this.columnList = this.columnList.sort((a, b) => a.id - b.id);
      console.log(this.columnList);
    },
    getBanner() {
      this.$api.findData.getBanner().then(({ data }) => {
        this.bannerList = data.banners;
      });
    },
    getPersonalized() {
      this.$api.findData.getPersonalized().then(({ data }) => {
        console.log(data);

        this.songSheetList = data.result;
      });
    },
    getRecommendResource() {
      this.$api.findData.getRecommendResource().then(({ data }) => {
        console.log(data);

        // this.songSheetList = data.recommend;
      });
    },
    getPersonalizedNewsong() {
      this.$api.findData.getPersonalizedNewsong().then(({ data }) => {
        console.log(data);

        this.newSongList = data.result;
      });
    },
    getPersonalizedMv() {
      this.$api.findData.getPersonalizedMv().then(({ data }) => {
        console.log(data);

        this.videoList = data.result;
      });
    },
    getPersonalizedDjprogram() {
      this.$api.findData.getPersonalizedDjprogram().then(({ data }) => {
        console.log(data);

        this.djList = data.result;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.g-find {
  width: 100%;
  padding: 20px 30px;
  .g-banner {
    width: 100%;
    .m-banner-img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
    }
    .m-tips {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 2px 10px;
      font-size: 12px;
      color: #fff;
      border-radius: 8px 0 8px 0;
      background: #d54b4b;
    }
  }
  .m-change {
    margin-top: 80px;
    text-align: center;
    font-size: 12px;
    color: #aeaeae;
    .m-btn {
      width: 122px;
      height: 30px;
      line-height: 28px;
      margin: 10px auto 0;
      border-radius: 15px;
      font-size: 12px;
      color: @brand-color;
      border: 1px solid @brand-color;
      cursor: pointer;
      &:hover {
        background: @brand-color;
        color: #fff;
      }
    }
  }
  .m-reset {
    text-align: center;
    margin-top: 20px;
    text-decoration: underline;
    cursor: pointer;
  }
  .m-title {
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
    color: #cacaca;
  }
  .m-column-item {
    padding: 0px 20px;
    cursor: move;
    div {
      padding: 10px 0;
      border-bottom: 1px solid #f3f3f3;
    }
    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>

<style lang="less">
.m-column-dialog .el-dialog--center .el-dialog__body {
  padding: 0 0 30px 0;
}
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #f5f5f5;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
