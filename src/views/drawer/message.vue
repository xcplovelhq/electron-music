<template>
  <div class="g-message ">
    <tab-list :tabList="tabList" @getTabIndex="getTabIndex"></tab-list>
    <div class="m-tips" v-if="showTips">暂无{{ name }}内容</div>
    <Loading
      v-if="messageList && messageList.length <= 0 && !showTips"
    ></Loading>
    <div class="m-message" v-else>
      <ul>
        <li
          v-for="item in messageList"
          :key="item.id"
          :class="{ active: name === '评论' || name === '@我' }"
        >
          <Avata
            :ImgUrl="
              (item.fromUser && item.fromUser.avatarUrl) ||
                (item.notice && item.notice.user.avatarUrl) ||
                (item.user && item.user.avatarUrl) ||
                (item.json && item.json.comment.user.avatarUrl)
            "
            Size="35"
            style="min-width: 35px"
          ></Avata>
          <div class="m-info">
            <div class="m-title">
              <div class="m-name">
                {{
                  (item.fromUser && item.fromUser.nickname) ||
                    (item.notice && item.notice.user.nickname) ||
                    (item.user && item.user.nickname) ||
                    (item.json && item.json.comment.user.nickname)
                }}
              </div>
              <div class="m-time">{{ getTime(item) }}</div>
            </div>
            <div class="m-text" v-html="getText(item)"></div>
            <div class="m-reply" v-if="name === '评论' || name === '@我'">
              <template v-if="name === '评论'">
                {{ item.beRepliedContent }}
              </template>
              <template v-else>
                <Avata
                  :ImgUrl="
                    item.json &&
                      (item.json.resource.coverImgUrl ||
                        item.json.resource.album.picUrl)
                  "
                  Size="40"
                  Radius="8"
                  style="min-width: 35px"
                ></Avata>
                <div class="m-reply-info">
                  <h3>{{ item.json.resource.name }}</h3>
                  <p v-if="item.json.resource.creator">
                    by {{ item.json.resource.creator.nickname }}
                  </p>
                  <p
                    v-else-if="
                      item.json.resource.artists &&
                        item.json.resource.artists.length > 0
                    "
                  >
                    <template v-for="v in item.json.resource.artists">
                      {{ v.name }}
                    </template>
                  </p>
                </div>
              </template>
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
  data () {
    return {
      showTips: false,
      limit: 20,
      messageList: [],
      name: "私信",
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
  created () {
    this.getMsgProvate();
  },
  methods: {
    getText (item) {
      let text = "";
      let content = "";
      let regName = /@(\S*)/;
      let regText = /([^\s]+)$/;

      switch (this.name) {
        case "私信":
          if (item.lastMsg.msg) {
            text =
              ((item.lastMsg.promotionUrl &&
                item.lastMsg.promotionUrl.text + "：") ||
                "") + item.lastMsg.msg;
          } else {
            text = item.lastMsg.title;
          }
          break;

        case "评论":
          if (regName.test(item.content)) {
            content = `<a>${item.content.match(regName)[0]}</a> ${
              item.content.match(regText)[0]
              }`;
          } else {
            content = item.content;
          }
          if (item.beRepliedUser) {
            text = "回复我：" + content;
          } else {
            text = content;
          }
          break;

        case "@我":
          if (regName.test(item.json.comment.content)) {
            text = `评价：<a>${
              item.json.comment.content.match(regName)[0]
              }</a> ${item.json.comment.content.match(regText)[0]}`;
          } else {
            text = "评价：" + item.json.comment.content;
          }
          break;

        case "通知":
          text = `我分享了单曲「${
            JSON.parse(item.notice.track.json).song.name
            }」`;
          break;

        default:
          break;
      }
      return text;
    },
    getTime (item) {
      let time = "";
      let timeData = "";
      let timeNow = this.$moment();
      if (this.name === "私信") {
        timeData = this.$moment(item.lastMsgTime);
      } else {
        timeData = this.$moment(item.time);
      }

      if (timeNow.format("YYYYMMDD") == timeData.format("YYYYMMDD")) {
        time = timeData.format("kk:mm");
      } else if (
        timeNow.subtract(1, "days").format("YYYYMMDD") ==
        timeData.format("YYYYMMDD")
      ) {
        time = timeData.format("昨天 kk:mm");
      } else if (timeNow.format("YYYY") == timeData.format("YYYY")) {
        time = timeData.format("M月DD日");
      } else {
        time = timeData.format("YYYY年M月DD日");
      }
      return time;
    },
    getTabIndex (name) {
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
    getMsgProvate () {
      this.$api.userData.getMsgProvate({}).then(({ data }) => {
        if (data.msgs && data.msgs.length > 0) {
          this.messageList = data.msgs;
          this.tabList[0].badge = data.newMsgCount;
          this.messageList.forEach(item => {
            if (item.lastMsg) {
              item.lastMsg = JSON.parse(item.lastMsg);
            }
          });
        } else {
          this.showTips = true;
        }
      });
    },
    getMsgComments () {
      this.$api.userData
        .getMsgComments({
          uid: this.$store.state.User.userInfo.userId
        })
        .then(({ data }) => {
          if (data.comments && data.comments.length > 0) {
            this.messageList = data.comments;
            this.tabList[1].badge = data.newCount;
          } else {
            this.showTips = true;
          }
        });
    },
    getMsgForwards () {
      this.$api.userData.getMsgForwards({}).then(({ data }) => {
        if (data.forwards && data.forwards.length > 0) {
          this.messageList = data.forwards;
          this.tabList[2].badge = data.newCount;

          this.messageList.forEach(item => {
            if (item.json) {
              item.json = JSON.parse(item.json);
            }
          });
          console.log(this.messageList);
        } else {
          this.showTips = true;
        }
      });
    },
    getMsgNotices () {
      this.$api.userData.getMsgNotices({}).then(({ data }) => {
        if (data.notices && data.notices.length > 0) {
          this.messageList = data.notices;
          this.tabList[3].badge = data.newCount;

          this.messageList.forEach(item => {
            if (item.notice) {
              item.notice = JSON.parse(item.notice);
            }
          });
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
      &.active:hover {
        background: #fff;
      }
      .m-info {
        width: 100%;
        margin-left: 6px;
        padding-bottom: 10px;
        border-bottom: 1px solid #fafafa;
        cursor: pointer;
        .m-title {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 13px;
          color: #607cac;
        }
        .m-time {
          font-size: 12px;
          color: #c9cfcf;
        }
        .m-text {
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .m-reply {
          display: flex;
          margin-top: 10px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 12px;
          &:hover {
            background: #eee;
          }
          .m-reply-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 10px;
            p {
              color: #8e8e8e;
            }
          }
        }
      }
    }
  }
}
</style>
