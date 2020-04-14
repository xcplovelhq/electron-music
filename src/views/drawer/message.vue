<template>
  <div class="g-message ">
    <tab-list :tabList="tabList" @getTabIndex="getTabIndex"></tab-list>
    <div class="m-tips" v-if="showTips">暂无{{ name }}内容</div>
    <Loading
      v-if="messageList && messageList.length <= 0 && !showTips"
    ></Loading>
    <div class="m-message" v-else>
      <ul>
        <li v-for="item in messageList" :key="item.id">
          <Avata
            :ImgUrl="
              (item.fromUser && item.fromUser.avatarUrl) ||
                getAvatarual(item).user.avatarUrl
            "
            Size="35"
            style="min-width: 35px"
          ></Avata>
          <div class="m-info">
            <div class="m-title">
              <div class="m-name">
                {{
                  (item.fromUser && item.fromUser.nickname) ||
                    getAvatarual(item).user.nickname
                }}
              </div>
            </div>
            <div class="m-text">
              {{ getText(item) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TabList from "@/components/Tabs";
import Avata from "@/components/Avata";
import Loading from "@/components/Loading";

export default {
  components: {
    TabList,
    Avata,
    Loading
  },
  data() {
    return {
      showTips: false,
      limit: 20,
      messageList: [],
      name: "",
      tabList: [
        {
          isActive: true,
          badge: 9,
          name: "私信"
        },
        {
          isActive: false,
          name: "评论"
        },
        {
          isActive: false,
          name: "@我"
        },
        {
          isActive: false,
          name: "通知"
        }
      ]
    };
  },
  created() {
    this.getMsgProvate();
  },
  methods: {
    getText(item) {
      let lastMsg = JSON.parse(item.lastMsg || item.notice);
      if (lastMsg.track) {
        return `我分享了单曲「${JSON.parse(lastMsg.track.json).song.name}」`;
      } else {
        return (
          ((lastMsg.promotionUrl && lastMsg.promotionUrl.text + "：") || "") +
          lastMsg.msg
        );
      }
    },
    getAvatarual(item) {
      let notice = JSON.parse(item.notice);
      console.log(notice);

      return notice;
    },
    getTabIndex(name) {
      this.messageList = [];
      this.showTips = false;
      this.tabList.forEach(item => {
        item.isActive = false;
        if (item.name === name) {
          item.isActive = true;
          this.name = item.name;
          switch (name) {
            case "私信":
              this.getMsgProvate();
              break;
            case "评论":
              this.getMsgComments();
              break;
            case "@我":
              this.getMsgForwards();
              break;
            case "通知":
              this.getMsgNotices();
              break;
            default:
              break;
          }
        }
      });
    },
    getMsgProvate() {
      this.$api.userData.getMsgProvate({}).then(({ data }) => {
        if (data.msgs && data.msgs.length > 0) {
          console.log("321321");

          this.messageList = data.msgs;
        } else {
          this.showTips = true;
        }
      });
    },
    getMsgComments() {
      this.$api.userData
        .getMsgComments({
          uid: this.$store.state.User.userInfo.userId
        })
        .then(({ data }) => {
          if (data.comments && data.comments.length > 0) {
            this.messageList = data.comments;
          } else {
            this.showTips = true;
          }
        });
    },
    getMsgForwards() {
      this.$api.userData.getMsgForwards({}).then(({ data }) => {
        if (data.forwards && data.forwards.length > 0) {
          this.messageList = data.forwards;
        } else {
          this.showTips = true;
        }
      });
    },
    getMsgNotices() {
      this.$api.userData.getMsgNotices({}).then(({ data }) => {
        if (data.notices && data.notices.length > 0) {
          this.messageList = data.notices;
        } else {
          this.showTips = true;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.g-message {
  height: 100%;
  padding-top: 20px;
  .m-tips {
    text-align: center;
    font-size: 12px;
    padding-top: 100px;
    color: #6c6c6c;
  }
  .m-message {
    height: calc(100% - 40px);
    overflow-y: auto;
    margin-top: 10px;
    li {
      display: flex;
      padding: 10px 20px 0;
      &:hover {
        background: #f6f6f7;
      }
      .m-info {
        cursor: pointer;
        margin-left: 6px;
        padding-bottom: 10px;
        border-bottom: 1px solid #fafafa;
        .m-title {
          font-size: 13px;
          color: #607cac;
        }
        .m-text {
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
