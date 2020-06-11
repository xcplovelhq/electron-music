<template>
  <div class="g-comment">
    <div class="m-input-comment">
      <el-input
        type="textarea"
        ref="comment"
        placeholder="输入评论"
        v-model="commentText"
        maxlength="140"
        :rows="3"
        show-word-limit
        resize="none"
      >
      </el-input>
      <div class="flex-justify-end" style="margin-top: 10px;">
        <el-button plain size="small" round @click="handleSend">评论</el-button>
      </div>
    </div>
    <Loading v-if="isLoading"></Loading>

    <template v-else>
      <div class="m-no-common" v-if="commentList[1].list.length <= 0">
        还没有评论哦，快来抢沙发~
      </div>
      <template v-else>
        <template v-for="item in commentList">
          <div
            class="m-box"
            :key="item.title"
            v-if="item.isShow && item.list.length > 0"
          >
            <h3>
              {{ item.title
              }}{{ item.title === "最新评论" ? `（${total}）` : "" }}
            </h3>
            <ul v-if="!isLoading">
              <li v-for="v in item.list" :key="v.commentId">
                <div class="m-img">
                  <Avata :ImgUrl="v.user.avatarUrl" Size="35"></Avata>
                </div>
                <div class="m-info">
                  <div class="m-comment">
                    <router-link
                      :to="{
                        name: 'userDetails',
                        query: { id: v.user.userId }
                      }"
                      >{{ v.user.nickname }}:</router-link
                    >
                    {{ v.content }}
                  </div>
                  <div
                    class="m-comment m-reply"
                    v-if="v.beReplied && v.beReplied.length > 0"
                  >
                    <router-link
                      :to="{
                        name: 'userDetails',
                        query: { id: v.beReplied[0].user.userId }
                      }"
                      >@{{ v.beReplied[0].user.nickname }}:</router-link
                    >
                    {{ v.beReplied[0].content }}
                  </div>
                  <div class="m-tips flex-justify-between">
                    <div class="m-time">
                      {{ $moment(v.time).format("M月D日 kk:mm") }}
                    </div>
                    <div class="m-order">
                      <div class="i-zan" @click="handleZan(v)">
                        <i class="iconfont" :class="{ active: v.liked }"
                          >&#xe611;</i
                        >{{ v.likedCount }}
                      </div>
                      <div @click="handleComment(v)">
                        <i class="iconfont">&#xe620;</i>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <div class="m-pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="params.offset"
            :page-size="params.limit"
            :total="total"
            @current-change="handleChange"
          ></el-pagination>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Avata from "@/components/Avata";
import Loading from "@/components/Loading";

export default {
  components: {
    Avata,
    Loading
  },
  data() {
    return {
      isAllLoading: false,
      isLoading: false,
      total: 0,
      commentText: "",
      commentId: 0,
      replyUser: "",
      typeNum: 0,
      t: 1,
      params: {
        offset: 0,
        limit: 60
      },
      commentList: [
        {
          title: "精彩评论",
          isShow: true,
          list: []
        },
        {
          title: "最新评论",
          isShow: true,
          list: []
        }
      ]
    };
  },
  props: {
    type: String,
    random: Number,
    id: [String, Number]
  },
  created() {
    this.getData(1);
  },
  mounted() {},
  methods: {
    getData(row) {
      switch (this.type) {
        case "songSheet":
          this.typeNum = 0;
          this.getCommentPlaylist(row);
          break;
        case "album":
          this.typeNum = 2;

          this.getCommentAlbum(row);
          break;
        case "playing":
          this.typeNum = 0;

          this.getCommentMusic(row);
          break;
        case "video":
          this.typeNum = 5;

          this.getCommentVideo(row);
          break;
        case "mv":
          this.typeNum = 1;

          this.getCommentMv(row);
          break;
        case "dynamic":
          this.typeNum = 6;
          this.isLoading = true;
          this.getCommentEvent(row);
          break;
        default:
          break;
      }
    },
    handleChange(row) {
      this.params.offset = row;
      this.getData(row);
    },
    handleSend() {
      let commentId = null;
      this.t = 1;
      if (this.commentText.indexOf(this.replyUser) >= 0) {
        commentId = this.commentId;
        this.t = 2;
      }
      this.$api.userData
        .setComment({
          t: this.t,
          type: this.typeNum,
          content: this.commentText,
          commentId: commentId,
          threadId: this.id || this.$route.query.id
        })
        .then(() => {
          this.getData(1);
          this.$toasted.show("评论成功");
        });
    },
    handleZan(item) {
      this.$api.userData
        .setCommentLike({
          type: 6,
          cid: item.commentId,
          threadId: this.id || this.$route.query.id,
          t: !item.liked ? 1 : 0
        })
        .then(() => {
          if (item.liked) {
            item.liked = false;
            item.likedCount--;
          } else {
            item.liked = true;
            item.likedCount++;
          }
        });
    },
    handleComment(item) {
      this.replyUser = `回复${item.user.nickname}：`;
      this.commentText = this.replyUser;
      this.commentId = item.commentId;
      this.$refs.comment.focus();
    },
    getCommentPlaylist(offset) {
      let hotC = this.commentList[0];
      let newC = this.commentList[1];
      this.isLoading = true;
      newC.list = [];
      hotC.list = [];
      if (this.params.offset > 1) {
        hotC.isShow = false;
      } else {
        hotC.isShow = true;
      }
      this.$api.songData
        .getCommentPlaylist({
          id: this.$route.query.id,
          limit: this.params.limit,
          offset: offset - 1
        })
        .then(({ data }) => {
          this.total = data.total;
          hotC.list = data.hotComments || [];
          newC.list = data.comments || [];

          this.isLoading = false;
        });
    },
    getCommentAlbum(offset) {
      let hotC = this.commentList[0];
      let newC = this.commentList[1];
      this.isLoading = true;
      newC.list = [];
      hotC.list = [];
      if (this.params.offset > 1) {
        hotC.isShow = false;
      } else {
        hotC.isShow = true;
      }
      this.$api.albumData
        .getCommentAlbum({
          id: this.$route.query.id,
          limit: this.params.limit,
          offset: offset - 1
        })
        .then(({ data }) => {
          this.total = data.total;
          hotC.list = data.hotComments || [];
          newC.list = data.comments || [];
          this.isLoading = false;
        });
    },
    getCommentMusic(offset) {
      let hotC = this.commentList[0];
      let newC = this.commentList[1];
      this.isLoading = true;
      newC.list = [];
      hotC.list = [];
      if (this.params.offset > 1) {
        hotC.isShow = false;
      } else {
        hotC.isShow = true;
      }

      this.$api.musicData
        .getCommentMusic({
          id: this.$store.state.Play.playInfo.id,
          limit: this.params.limit,
          offset: offset - 1
        })
        .then(({ data }) => {
          this.total = data.total;
          hotC.list = data.hotComments || [];
          newC.list = data.comments || [];
          this.isLoading = false;
        });
    },
    getCommentVideo(offset) {
      let hotC = this.commentList[0];
      let newC = this.commentList[1];
      this.isLoading = true;
      newC.list = [];
      hotC.list = [];
      if (this.params.offset > 1) {
        hotC.isShow = false;
      } else {
        hotC.isShow = true;
      }

      this.$api.videoData
        .getCommentVideo({
          id: this.$route.query.id,
          limit: this.params.limit,
          offset: offset - 1
        })
        .then(({ data }) => {
          this.total = data.total;
          hotC.list = data.hotComments || [];
          newC.list = data.comments || [];
          this.isLoading = false;
        });
    },
    getCommentMv(offset) {
      let hotC = this.commentList[0];
      let newC = this.commentList[1];
      this.isLoading = true;
      newC.list = [];
      hotC.list = [];
      if (this.params.offset > 1) {
        hotC.isShow = false;
      } else {
        hotC.isShow = true;
      }

      this.$api.videoData
        .getCommentMv({
          id: this.$route.query.id,
          limit: this.params.limit,
          offset: offset - 1
        })
        .then(({ data }) => {
          this.total = data.total;
          hotC.list = data.hotComments || [];
          newC.list = data.comments || [];
          this.isLoading = false;
        });
    },
    getCommentEvent() {
      let hotC = this.commentList[0];
      let newC = this.commentList[1];

      newC.list = [];
      hotC.list = [];
      if (this.params.offset > 1) {
        hotC.isShow = false;
      } else {
        hotC.isShow = true;
      }
      this.$api.userData
        .getCommentEvent({
          threadId: this.id || this.$route.query.id
        })
        .then(({ data }) => {
          this.total = data.total;
          hotC.list = data.hotComments || [];
          newC.list = data.comments || [];
          this.isLoading = false;
        });
    }
  },
  watch: {
    random() {
      this.getData(1);
    }
  }
};
</script>

<style lang="less" scoped>
.g-comment {
  padding-bottom: 40px;
  h3 {
    font-size: 14px;
  }
  .m-box {
    margin-bottom: 40px;
  }
  .m-no-common {
    padding-top: 50px;
    text-align: center;
    font-size: 12px;
  }
  ul {
    li {
      display: flex;
      padding: 20px 0 0;
      .m-img {
        width: 35px;
        margin-right: 10px;
      }
      .m-info {
        flex: 1;
        border-bottom: 1px solid #f3f3f3;
        padding-bottom: 20px;
        .m-comment {
          font-size: 13px;
          color: #333;
          a {
            color: #8ba1c3;
            &:hover {
              color: #6b86b2;
            }
          }
        }
        .m-reply {
          margin-top: 8px;
          padding: 10px 8px;
          border-radius: 8px;
          background: #f0eff0;
        }
        .m-tips {
          margin-top: 7px;
        }
        .m-time {
          font-size: 12px;
          color: #d7d7d7;
        }
        .m-order {
          display: flex;
          font-size: 12px;
          color: #939393;
          .i-zan {
            .iconfont {
              margin-right: 5px;
            }
          }
          div {
            padding: 0 10px;
            border-right: 1px solid #f4f4f4;
            &:last-child {
              border-right: 0;
            }
          }
          .iconfont {
            font-size: 12px;
            color: #7d7c7d;
            &.active {
              color: @brand-color;
            }
          }
        }
      }
    }
  }
  .m-pagination {
    text-align: center;
    margin-top: 40px;
  }
}
</style>

<style lang="less">
.g-comment .el-pagination.is-background .el-pager li:not(.disabled).active {
  background: @brand-color;
}
.g-comment
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active:hover {
  color: #fff;
}
.g-comment .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #606266;
}
</style>
