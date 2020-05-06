<template>
  <div
    class="g-follow-fans"
    v-infinite-scroll="load"
    infinite-scroll-immediate
    :infinite-scroll-distance="20"
  >
    <div class="m-item" v-for="item in list" :key="item.id">
      <my-image
        :ImgUrl="item.avatarUrl"
        Size="90px"
        style="cursor: pointer;"
      ></my-image>
      <div class="m-info">
        <div class="m-name">{{ item.nickname }}</div>
        <div>
          <div class="m-desc">{{ item.signature }}</div>
          <div class="m-counts">
            <div class="m-count">歌单：{{ item.playlistCount }}</div>
            <div class="m-count">粉丝：{{ item.followeds }}</div>
          </div>
        </div>
      </div>
      <div class="m-btn"><i class="iconfont">&#xe61e;</i>关注</div>
    </div>
  </div>
</template>

<script>
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  data() {
    return {
      limit: 30,
      type: "",
      list: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getData();
    },
    getUserFollows() {
      this.$api.userData
        .getUserFollows({
          uid: this.$route.query.id,
          limit: this.limit
        })
        .then(({ data }) => {
          this.list = data.follow;
        });
    },
    getUserFolloweds() {
      this.$api.userData
        .getUserFolloweds({
          uid: this.$route.query.id,
          limit: this.limit
        })
        .then(({ data }) => {
          this.list = data.followeds;
        });
    },
    getData() {
      this.type = this.$route.query.type;
      if (this.type === "follow") {
        this.getUserFollows();
      } else {
        this.getUserFolloweds();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.g-follow-fans {
  display: grid;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 400px);
  .m-item {
    display: flex;
    width: 400px;
    align-items: center;
    padding: 10px 30px;
    &:hover {
      background: #fafafa;
    }
    .m-info {
      flex: 1;
      margin-left: 5px;
      font-size: 12px;
      .m-name {
        margin-bottom: 20px;
        font-size: 14px;
        color: #000;
      }
      .m-desc {
        height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .m-counts {
        display: flex;
      }
    }
    .m-btn {
      width: 60px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 12px;
      border: 1px solid #d9d9d9;
      border-radius: 24px;
      cursor: pointer;
      .iconfont {
        color: #e87c7a;
        vertical-align: top;
      }
    }
  }
}
</style>
