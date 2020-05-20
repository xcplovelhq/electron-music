<template>
  <div class="g-user-details">
    <div class="m-song-info">
      <Avata
        :ImgUrl="info.avatarUrl"
        Size="200"
        style="min-width: 200px"
      ></Avata>
      <div class="m-info">
        <div class="m-name">
          {{ info.nickname }}
        </div>
        <div class="flex-justify-between">
          <div class="m-medal">
            <div class="m-musician" v-if="getMusician">
              <i class="iconfont z-small">&#xe615;</i>{{ getMusician }}
            </div>
            <div class="m-start" v-if="getStart">
              <i class="iconfont z-small">&#xe614;</i>{{ getStart }}
            </div>
            <div class="m-vip" v-if="info.vipType == 11">
              黑胶<img src="@/assets/vip.png" />
            </div>
            <div class="m-level">Lv.{{ info.level }}</div>
            <div class="m-sex" v-if="info.gender === 1">
              <i class="iconfont">&#xe631;</i>
            </div>
            <div class="m-sex m-women" v-else>
              <i class="iconfont">&#xe632;</i>
            </div>
          </div>
          <div class="m-btns">
            <template v-if="getUserInfo.userId === info.userId">
              <div>
                <i class="iconfont" style="font-size:13px; margin-right: 5px"
                  >&#xe63d;</i
                >编辑个人信息
              </div>
            </template>
            <template v-else>
              <div v-if="info.artistId" @click="handleClick('singer')">
                <i class="iconfont">&#xe616;</i>歌手页
              </div>
              <div><i class="iconfont">&#xe60d;</i>发私信</div>
              <div>关注</div>
              <div class="m-last-btn"><i class="iconfont">&#xe71e;</i></div>
            </template>
          </div>
        </div>
        <div class="m-counts">
          <div class="m-count" @click="handleClick('dynamic')">
            <h3>{{ info.eventCount }}</h3>
            <p>动态</p>
          </div>
          <div class="m-line"></div>
          <div class="m-count" @click="handleClick('follow')">
            <h3>{{ info.follows }}</h3>
            <p>关注</p>
          </div>
          <div class="m-line"></div>
          <div class="m-count" @click="handleClick('fans')">
            <h3>{{ info.followeds }}</h3>
            <p>粉丝</p>
          </div>
        </div>
        <div class="m-text">
          <!-- <p>
            所在地区：
          </p> -->
          <div class="m-contact flex-justify-start">
            社交网络：
            <div class="m-weibo">
              <i class="iconfont">&#xe665;</i>
            </div>
            <div class="m-douban">
              <i class="iconfont">&#xe61b;</i>
            </div>
          </div>
          <div
            class="m-describe"
            :style="{ '-webkit-line-clamp': isMore ? '' : '1' }"
          >
            个人介绍：<span v-html="getDescribe"></span>
            <i
              class="iconfont"
              v-if="info.signature && info.signature.length > 40"
              @click="isMore = !isMore"
              >&#xe60a;</i
            >
          </div>
        </div>
      </div>
    </div>
    <div class="m-song">
      <div class="m-title">
        歌单
        <div class="m-type">
          <div :class="{ active: isType == 0 }" @click="isType = 0">
            <i class="iconfont">&#xe849;</i>
          </div>
          <div :class="{ active: isType == 1 }" @click="isType = 1">
            <i class="iconfont">&#xe859;</i>
          </div>
        </div>
      </div>
      <type-list :type="isType" dataType="user"></type-list>
    </div>
  </div>
</template>

<script>
import Avata from "@/components/Avata";
import TypeList from "@/components/TypeList";

export default {
  components: {
    Avata,
    TypeList
  },
  data() {
    return {
      isType: 0,
      isMore: false,
      info: {}
    };
  },
  created() {
    this.getUserDetail();
  },
  computed: {
    getUserInfo() {
      return this.$store.state.User.userInfo;
    },
    getDescribe() {
      let reg = /[\r\n]/g;

      return this.info.signature && this.info.signature.replace(reg, "<br />");
    },
    getMusician() {
      let text = "";
      this.info.allAuthTypes &&
        this.info.allAuthTypes.forEach(item => {
          if (item.type == 4) {
            text = item.desc;
          }
        });
      return text;
    },
    getStart() {
      let arr = "";
      if (this.info.expertTags && this.info.expertTags.length > 0) {
        arr = "音乐(" + this.info.expertTags.join("、") + ")";
      }
      if (this.info.experts) {
        for (let key in this.info.experts) {
          arr += "、" + this.info.experts[key];
        }
      }
      return arr;
    }
  },
  methods: {
    changeReg(v) {
      let reg = /[|]/g;

      return v && v.replace(reg, "、");
    },
    handleClick(type) {
      switch (type) {
        case "singer":
          this.$router.push({
            name: "singerDetails",
            query: { id: this.info.artistId }
          });
          break;
        case "dynamic":
          this.$router.push({
            name: "userDynamic",
            query: { id: this.info.userId }
          });
          break;
        case "follow":
          this.$router.push({
            name: "userFollowFans",
            query: { id: this.info.userId, type: "follow" }
          });
          break;
        case "fans":
          this.$router.push({
            name: "userFollowFans",
            query: { id: this.info.userId, type: "fans" }
          });
          break;
        default:
          break;
      }
    },
    handleCount() {
      this.$router.push({
        name: "singerDetails",
        query: { id: this.info.artistId }
      });
    },
    getUserDetail() {
      this.$api.userData
        .getUserDetail({
          uid: this.$route.query.id
        })
        .then(({ data }) => {
          this.info = data.profile;
          this.info.level = data.level;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-user-details {
  .m-song-info {
    display: flex;
    padding: 14px 30px;
  }
  .m-info {
    margin-left: 30px;
    flex: 1;
    .m-name {
      font-size: 24px;
      color: #333;
    }
    .flex-justify-between {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e6e6e6;
    }
    .m-medal {
      flex: 1;
      display: flex;
      margin-top: 10px;
      flex-wrap: wrap;
      div {
        margin-right: 5px;
        font-size: 12px;
        padding: 0 5px;
        border-radius: 25px;
        margin-bottom: 3px;
      }
      .m-musician {
        color: rgba(255, 255, 255, 0.8);
        background: #fb4942;
      }
      .m-start {
        color: #fff;
        background: #ffbd3b;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .m-vip {
        width: 60px;
        color: #ffe3e0;
        background: #000;
        img {
          border-radius: 25px;
          width: 26px;
          vertical-align: sub;
        }
      }
      .m-level {
        color: #fff;
        background: #ccc;
      }
      .z-small {
        margin-right: 5px;
        font-size: 12px;
        color: #fff;
      }
      .m-sex {
        padding: 0 10px;
        color: #68b9e8;
        background: #b3f3fe;
        .iconfont {
          font-size: 14px;
        }
        &.m-women {
          color: #ff4047;
          background: #ffced7;
        }
      }
    }
    .m-btns {
      display: flex;
      justify-content: flex-end;
      div {
        height: 30px;
        line-height: 28px;
        margin-right: 3px;
        padding: 0 14px;
        border-radius: 50px;
        border: 1px solid #d9d9d9;
        font-size: 13px;
        color: #666;
        cursor: default;
        &:hover {
          background: #f3f3f3;
        }
        &:first-child {
          .iconfont {
            font-size: 18px;
            vertical-align: bottom;
          }
        }
        &.m-last-btn {
          width: 30px;
          height: 30px;
          padding: 0;
          text-align: center;
          .iconfont {
            margin-right: 0;
          }
        }
        .iconfont {
          font-size: 14px;
          color: #666;
        }
      }
    }
    .m-counts {
      display: flex;
      .m-line {
        height: 45px;
        width: 2px;
        margin: 0 30px;
        background: #f1f1f1;
      }
      .m-count {
        text-align: center;
        cursor: pointer;
        &:hover {
          h3,
          p {
            color: #000;
          }
        }
      }
      h3 {
        font-size: 20px;
      }
      p {
        font-size: 12px;
        color: #858585;
      }
    }
    .m-contact {
      div {
        width: 17px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        border-radius: 9px;
        cursor: pointer;
        .iconfont {
          font-size: 12px;
          color: #fff;
        }
      }
    }
    .m-weibo {
      margin-right: 8px;
      background: #f14d53;
    }
    .m-douban {
      background: #009745;
    }
    .m-text {
      margin-top: 10px;
      font-size: 12px;
      color: #444;
      span {
        color: #878787;
      }
      .m-describe {
        margin-top: 10px;
        line-height: 20px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        .iconfont {
          position: absolute;
          right: 0;
          top: 0px;
          color: #999;
          cursor: pointer;
        }
      }
    }
  }
  .m-title {
    position: relative;
    padding: 10px 30px;
    .m-type {
      display: flex;
      position: absolute;
      right: 30px;
      top: 0;
      z-index: 1000;
      div {
        width: 25px;
        height: 20px;
        line-height: 18px;
        text-align: center;
        background: #f3f3f3;
        margin-right: 1px;
        cursor: default;
        &:hover {
          background: #e8e8e8;
        }
        &.active {
          background: #c0c0c0;
          .iconfont {
            color: #fff;
          }
        }
        .iconfont {
          font-size: 14px;
          color: #919191;
        }
      }
    }
  }
}
</style>
