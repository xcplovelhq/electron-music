<template>
  <div class="g-video">
    <div class="g-warper">
      <div class="m-nav">
        <div class="m-all">
          <el-popover
            placement="bottom-start"
            v-model="popover"
            trigger="click"
            width="720px"
          >
            <div class="m-popover">
              <div class="m-classify">
                <ul>
                  <template v-for="item in videoGroupList">
                    <li :key="item.id" @click="handleClick(item)">
                      <div
                        class="m-name"
                        :class="{ active: videoGroupId === item.id }"
                      >
                        {{ item.name }}
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <div class="m-btn" slot="reference">
              {{ videoGroupValue }}<i class="iconfont">&#xe72b;</i>
            </div>
          </el-popover>
        </div>
        <div class="m-classify">
          <ul>
            <template v-for="(item, idx) in videoGroupList">
              <li :key="item.id" v-if="idx < 8">
                <div
                  class="m-name"
                  :class="{ active: videoGroupId === item.id }"
                  @click="handleClick(item)"
                >
                  {{ item.name }}
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <Loading v-if="videoList && videoList.length <= 0"></Loading>
      <mv-list v-else :list="videoList" type="video"></mv-list>
    </div>
  </div>
</template>

<script>
import MvList from "./components/mv-list";
import Loading from "@/components/Loading";

export default {
  components: {
    MvList,
    Loading
  },
  data() {
    return {
      popover: false,
      videoGroupId: 0,
      videoGroupValue: "",
      videoGroupList: [],
      videoList: []
    };
  },
  created() {
    this.getVideoGroupList();
  },
  methods: {
    handleClick(row) {
      this.videoGroupId = row.id;
      this.videoGroupValue = row.name;
      this.popover = false;
      this.getVideoGroup(row);
    },
    getVideoGroup(row) {
      this.videoList = [];
      this.$api.videoData
        .getVideoGroup({
          id: row.id,
          type: 1004,
          limit: 100
        })
        .then(({ data }) => {
          this.videoList = data.datas;
        });
    },
    getVideoGroupList() {
      this.$api.videoData.getVideoGroupList().then(({ data }) => {
        this.videoGroupList = data.data;
        this.videoGroupValue = this.videoGroupList[0].name;
        this.videoGroupId = this.videoGroupList[0].id;
        this.getVideoGroup(this.videoGroupList[0]);
      });
    }
  }
};
</script>
<style lang="less">
.g-video,
.m-popover {
  .g-warper {
    padding: 15px 30px;
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
.g-video {
  .m-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 0;
  }
}
.m-popover {
  width: 700px;

  .m-title {
    padding: 10px 0 20px 18px;
    border-bottom: 1px solid #e5e5e5;
    cursor: default;
    &:hover {
      color: #c6382e;
    }
    &.active {
      color: #c6382e;
      background: #fbf6f6;
      border-radius: 50px;
    }
  }
  ul {
    padding: 0 6px;
    height: 393px;
    overflow-y: auto;
    li {
      cursor: pointer;
      width: 110px;
      margin-bottom: 10px;
      border-right: 0 !important;
    }
  }
  .m-name {
    display: inline-block;
    margin: 0;
    padding: 8px 13px;
    font-size: 13px;
    color: #444;
    &:hover {
      color: #c6382e;
    }
  }
}
</style>
