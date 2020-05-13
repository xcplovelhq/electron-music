<template>
  <div class="g-user-dynamic">
    <div class="m-dynamic">
      <ul
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        infinite-scroll-immediate="false"
      >
        <li v-for="(item, index) in list" :key="item.commentId">
          <template v-if="item.type !== 33">
            <Dynamic :item="item" :index="index"></Dynamic>
          </template>
          <template v-else>
            <div
              class="m-topic"
              :style="{
                background: `url(${item.json.coverPCUrl}) center`,
                backgroundSize: '100% 100%'
              }"
            >
              <div class="m-topic-warper">
                <div class="m-topic-text">
                  <el-divider></el-divider>
                  #{{ item.json.title }}#
                  <div class="m-line-box">
                    <div class="m-line"></div>
                    <div class="m-line-text">
                      {{ item.json.participateCount }}人参与
                    </div>
                    <div class="m-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
      <Loading v-if="loading">
        <span style="font-size:14px; margin-left:5px;">加载中...</span>
      </Loading>
      <p v-if="!more">没有更多了</p>
    </div>
    <div class="m-topic-warper"></div>
    <div class="m-topic-list">
      <g-title
        title="热门话题"
        style="padding-left:20px;font-size: 14px;"
      ></g-title>
      <ul>
        <li v-for="item in topicList" :key="item.actId">
          <my-image
            :ImgUrl="item.sharePicUrl"
            Size="35px"
            Radius="4"
          ></my-image>
          <div class="m-info">
            <div class="m-title">
              {{ item.title }}
            </div>
            <div class="m-name">{{ item.participateCount }}人参与</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Dynamic from "./components/dynamic";

import Loading from "@/components/Loading";
import MyImage from "@/components/Image";
import GTitle from "@/components/Title";

export default {
  components: {
    Dynamic,
    Loading,
    MyImage,
    GTitle
  },
  data() {
    return {
      limit: 10,
      offset: 0,
      loading: false,
      more: true,
      isLoading: false,
      list: [],
      topicList: [],
      lasttime: -1
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  created() {
    this.getData();
    this.getHotTopic();
  },
  methods: {
    load() {
      if (this.$route.name === "userDynamic") {
        this.getData();
      }
    },
    getEvents(events, data) {
      events.forEach(item => {
        item.json = JSON.parse(item.json);
        if (item.json.event) {
          item.json.event.json = JSON.parse(item.json.event.json);
          item.json.event.picsList = [];
          item.json.event.isShowPic = false;
          item.json.event.showPic = "";
          if (item.json.event.pics && item.json.event.pics.length > 0) {
            item.json.event.pics.forEach(v => {
              item.json.event.picsList.push(v.originUrl);
            });
          }
          if (item.json.event.json.mv || item.json.event.json.video) {
            item.json.event.isShowMv = false;
          }
        }
        if (item.json.mv || item.json.video) {
          item.isShowMv = false;
        }
        item.picsList = [];
        item.isShowPic = false;
        item.showPic = "";
        if (item.pics && item.pics.length > 0) {
          item.pics.forEach(v => {
            item.picsList.push(v.originUrl);
          });
        }
        this.list.push(item);
      });
      this.more = data.more;
      this.loading = false;
      this.lasttime = data.lasttime;
    },
    getData() {
      // this.list = [];
      this.loading = true;
      if (this.$route.query.type === "friend") {
        this.$api.userData
          .getEvent({
            pagesize: 30,
            lasttime: this.lasttime
          })
          .then(({ data }) => {
            this.getEvents(data.event, data);
          });
      } else {
        this.$api.userData
          .getUserEvent({
            uid: this.$route.query.id,
            lasttime: this.lasttime
          })
          .then(({ data }) => {
            console.log(data);

            this.getEvents(data.events, data);
          });
      }
    },
    getHotTopic() {
      this.$api.userData
        .getHotTopic({
          limit: this.limit,
          offset: this.offset
        })
        .then(({ data }) => {
          this.topicList = data.hot;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-user-dynamic {
  position: relative;
  display: flex;
  padding: 20px 0 30px 20px;
  .m-dynamic {
    flex: 1;
    ul {
      li {
        display: flex;
        padding: 20px 0 0;
        border-bottom: 1px solid #f3f3f3;
        &:first-child {
          padding: 0;
        }
      }
    }
  }
  .m-topic-warper {
    width: 270px;
  }
  .m-topic-list {
    position: fixed;
    right: 0;
    top: 70px;
    width: 240px;
    border-left: 1px solid #e6e6e6;
    li {
      display: flex;
      padding: 5px 0 5px 20px;
      .m-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 5px;
      }
      .m-title {
        font-size: 12px;
        color: #555;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .m-name {
        font-size: 12px;
        color: #a0a0a0;
      }
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>

<style lang="less">
.g-user-dynamic {
  .m-hover {
    color: #7992b9;
    cursor: pointer;
    &:hover {
      color: #4c6eb8;
    }
    .iconfont {
      vertical-align: bottom;
    }
  }
}
</style>
