<template>
  <div class="g-user-dynamic">
    <ul>
      <li v-for="(item, index) in list" :key="item.commentId">
        <template v-if="item.type !== 33">
          <div class="m-img">
            <Avata :ImgUrl="item.user.avatarUrl" Size="35"></Avata>
          </div>
          <div class="m-info">
            <div class="m-name">
              <router-link
                :to="{ name: 'userDetails', query: { id: item.user.userId } }"
                >{{ item.user.nickname }}</router-link
              >
              {{ getType(item.type) }}
            </div>
            <div class="m-time">
              {{ $moment(item.eventTime).format("YYYY年M月D日 kk:mm") }}
            </div>
            <div
              class="m-content"
              v-html="getContent(item)"
              @click="handleOpenUrl($event)"
            ></div>
            <div
              class="m-share"
              v-if="
                item.json.song ||
                  item.json.resource ||
                  item.json.album ||
                  item.json.event ||
                  item.isShowPic
              "
              :class="{ 'z-font': item.type == 36 }"
            >
              <share-box :row="item" v-if="!item.json.event"></share-box>
              <div v-if="item.json.event" class="m-share-event">
                <div class="m-name">
                  <div
                    class="m-content"
                    v-html="getContent(item.json.event, 'event')"
                  ></div>
                </div>
                <share-box
                  :row="item.json.event"
                  class="m-share-event-box"
                ></share-box>
                <pics
                  v-show="!item.isShowPic"
                  :row="item.json.event"
                  @hanldeEnlarge="
                    (pic, row, idx) => hanldeEnlarge(pic, row, idx, item)
                  "
                ></pics>
              </div>
              <div class="m-enlarge-pic" v-show="item.isShowPic">
                <div class="m-handle">
                  <div @click="handleRetract(index)">
                    <i class="el-icon-upload2"></i>收起
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div @click="lookEnlarge(index)">
                    <i class="iconfont">&#xe60c;</i>查看大图
                  </div>
                  <!-- <div @click="lookEnlarge(index)">下载</div> -->
                </div>
                <!-- <Loading v-if="isLoading" style="margin-top:100px;"></Loading> -->
                <div class="m-enlarge-img" v-if="item.showPic">
                  <el-image
                    ref="elImage"
                    fit="fill"
                    :src="item.showPic + '?param=440x10000'"
                    style="vertical-align: middle;"
                    :preview-src-list="item.picsList"
                    @load="getImgLoad"
                  >
                  </el-image>
                  <div
                    class="m-left"
                    v-if="item.picIdx > 0"
                    @click="handleReduce(item, 'left')"
                  ></div>
                  <div
                    class="m-middle"
                    @click="handleReduce(item, 'middle')"
                  ></div>
                  <div
                    class="m-right"
                    v-if="item.picIdx < item.pics.length - 1"
                    @click="handleReduce(item, 'right')"
                  ></div>
                </div>
              </div>
            </div>
            <div class="m-enlarge-mv" v-if="item.isShowMv">
              <div class="m-handle">
                <div @click="handleRetract(index)">
                  <i class="el-icon-upload2"></i>收起
                </div>
                <el-divider direction="vertical"></el-divider>
                <div @click="handleMvTitle(item)" class="m-enlarge-title">
                  <div>
                    <i class="iconfont">&#xe60c;</i>{{ item.json.mv.name }} -
                  </div>
                  <span
                    @click.stop.prevent="handleGoSinger(i)"
                    v-for="(i, key) in item.json.mv.artists"
                    :key="key"
                    >{{ getSongName(i, key) }}</span
                  >
                </div>
                <!-- <div @click="lookEnlarge(index)">下载</div> -->
              </div>
              <my-video
                v-if="item.json.mv"
                :id="item.json.mv.id"
                :type="item.type === 21 ? 'mv' : 'video'"
              ></my-video>
            </div>
            <pics
              :row="item"
              @hanldeEnlarge="
                (pic, row, idx) => hanldeEnlarge(pic, row, idx, item)
              "
            ></pics>
            <div
              class="m-share-mv"
              v-if="item.json.mv && !item.isShowMv"
              @click="handleMv(item)"
            >
              <el-image
                :src="item.json.mv && item.json.mv.imgurl16v9"
              ></el-image>
              <div class="m-mv-title" @click="handleMvTitle(item)">
                {{ item.json.mv.name }} -
                <span v-for="(i, key) in item.json.mv.artists" :key="key">{{
                  getSongName(i, key)
                }}</span>
              </div>
              <div class="m-play-btn"></div>
              <div class="m-play-num">
                <i class="iconfont">&#xe607;</i
                >{{ getSumData(item.json.mv.playCount) }}
              </div>
              <div class="m-mv-time">
                {{ $moment(item.json.mv.duration).format("mm:ss") }}
              </div>
            </div>
            <div class="m-order">
              <div class="i-zan">
                <i class="iconfont">&#xe611;</i>{{ item.info.likedCount }}
              </div>
              <div>
                <i class="iconfont">&#xe60c;</i>{{ item.info.shareCount }}
              </div>
              <div>
                <i class="iconfont">&#xe620;</i>{{ item.info.commentCount }}
              </div>
            </div>
          </div>
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
  </div>
</template>

<script>
import Avata from "@/components/Avata";
// import Loading from "@/components/Loading";
import { ipcRenderer } from "electron";
import ShareBox from "./components/share";
import Pics from "./components/pics";
import MyVideo from "@/components/Video";
import { getSum } from "@/lib/utils";

export default {
  components: {
    Avata,
    // Loading,
    ShareBox,
    Pics,
    MyVideo
  },
  data () {
    return {
      isLoading: false,
      list: [],
      lasttime: -1
    };
  },
  created () {
    this.getData();
  },
  methods: {
    getSumData (time) {
      return getSum(time);
    },
    getSongName (item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    clickaa () {
      ipcRenderer.send("openUrl", "http://www.baidu.com");
    },

    getType (type) {
      let text = "";
      switch (type) {
        case 18:
          text = "分享单曲";
          break;
        case 21:
          text = "分享MV";
          break;
        case 22:
          text = "转发";
          break;
        case 35:
          text = "发布动态";
          break;
        case 36:
          text = "分享歌手";
          break;
        default:
          break;
      }
      return text;
    },
    getImgLoad () {
      this.isLoading = false;
    },
    getContent (row, type) {
      let msg = row.json.msg || "";
      let reg = /[\r\n]/g;
      let rep = new RegExp("#" + row.actName + "#", "g");
      let resDtring = `<span class="m-hover">#${row.actName}#</span>`;
      if (type === "event") {
        msg =
          "@" +
          row.user.nickname +
          " " +
          this.getType(row.type) +
          "：" +
          row.json.msg;
      }
      msg = msg ? this.remind(msg, type) : "";
      msg = msg.replace(rep, resDtring);
      msg = this.changeUrl(msg);
      return msg.replace(reg, "</br>");
    },
    remind (s) {
      let msg = s || "";
      if (typeof s != "string") return false;
      let reg = /@([0-9a-zA-Z\u4e00-\u9fa5]+)\s+?/g;
      if (msg.match(reg) && msg.match(reg).length > 0) {
        msg.match(reg).forEach(item => {
          msg = msg.replace(
            new RegExp(item, "g"),
            `<span class="m-hover">${item}</span>`
          );
        });
      }
      return msg || s;
    },
    changeUrl (s) {
      let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
      let resDtring = `<a class="m-hover" url="${s.match(reg) &&
        s.match(
          reg
        )[0]}" @click="clickaa"><i class="iconfont">&#xe6d4;</i>网页链接</a>`;
      return s.replace(reg, resDtring);
    },

    hanldeEnlarge (pic, row, idx, item) {
      this.isLoading = true;
      item.isShowPic = true;
      item.showPic = pic.originUrl;
      item.picIdx = idx;
    },

    handleReduce (row, type) {
      this.isLoading = true;
      switch (type) {
        case "left":
          row.showPic = row.pics[row.picIdx - 1].originUrl;
          row.picIdx--;
          break;
        case "middle":
          row.isShowPic = false;
          break;
        case "right":
          row.showPic = row.pics[row.picIdx + 1].originUrl;
          row.picIdx++;
          break;
        default:
          break;
      }
    },
    lookEnlarge (idx) {
      this.$refs.elImage[idx] && this.$refs.elImage[idx].clickHandler();
    },
    handleOpenUrl (event) {
      if (event.target.nodeName === "A") {
        ipcRenderer.send("openUrl", event.target.attributes.url.value);
      }
    },
    handleMv (item) {
      item.isShowMv = true;
      // item.showPic = pic.originUrl;
      // item.picIdx = idx;
    },
    handleMvTitle (row) {
      this.$router.push({
        name: "mvDetails",
        query: { id: row.json.mv.id, type: row.type === 21 ? "mv" : "video" }
      });
    },
    handleGoSinger (row) {
      this.$router.push({ name: "singerDetails", query: { id: row.id } });
    },
    getData () {
      this.list = [];
      if (this.$route.query.type === "friend") {
        this.$api.userData
          .getEvent({
            pagesize: 30,
            lasttime: this.lasttime
          })
          .then(({ data }) => {
            data.event.forEach(item => {
              item.json = JSON.parse(item.json);
              if (item.json.event) {
                item.json.event.json = JSON.parse(item.json.event.json);
              }
              if (item.json.mv) {
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
            this.lasttime = data.lasttime;
          });
      } else {
        this.$api.userData
          .getUserEvent({
            uid: this.$route.query.id,
            lasttime: this.lasttime
          })
          .then(({ data }) => {
            data.events.forEach(item => {
              item.json = JSON.parse(item.json);
              if (item.json.event) {
                item.json.event.json = JSON.parse(item.json.event.json);
              }
              if (item.json.mv) {
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
            this.lasttime = data.lasttime;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.g-user-dynamic {
  padding: 20px 30px;
  ul {
    li {
      display: flex;
      padding: 20px 0 0;
      border-bottom: 1px solid #f3f3f3;
      &:first-child {
        padding: 0;
      }
      .m-topic {
        width: 450px;
        height: 190px;

        border-radius: 8px;
        overflow: hidden;
        margin-left: 45px;
        margin-bottom: 20px;
        cursor: pointer;
        .m-topic-warper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          .m-topic-text {
            width: 145px;
            text-align: center;
            font-size: 20px;
            color: #fff;
            font-weight: 300;
          }
          .m-line-box {
            display: flex;
            align-items: center;

            margin: 15px 0;
          }
          .m-line {
            flex: 1;
            height: 1px;
            background: #dcdfe6;
          }
          .m-line-text {
            font-size: 12px;
            color: #fff;
            margin: 0 10px;
          }
        }
      }
      .m-img {
        width: 35px;
        margin-right: 10px;
      }
      .m-info {
        flex: 1;
        padding-bottom: 20px;
        .m-name {
          font-size: 13px;
          color: #333;
          a {
            color: #8ba1c3;
            &:hover {
              color: #4c6eb8;
            }
          }
        }
        .m-avata-bg {
          position: relative;
          width: 46px;
          // height: 155px;
          background: url(~@/assets/record-bg.png) no-repeat;
          background-size: cover;
        }
        .m-content {
          font-size: 13px;
          color: #555;
        }

        .m-share {
          margin-top: 8px;
          margin-bottom: 18px;
          border-radius: 8px;
          background: #f5f5f5;
          &.z-font {
            cursor: pointer;
            .m-singer-name {
              font-size: 14px;
              color: #333;
            }
          }
        }
        .m-share-event {
          padding: 8px 10px;
          cursor: pointer;
          .m-name {
            display: flex;
            flex-wrap: wrap;
            font-size: 12px;
          }
          .m-content {
            font-size: 12px;
          }
        }
        .m-share-event-box {
          margin-top: 8px;
          padding: 8px 8px;
          border-radius: 8px;
          background: #fff;
        }
        .m-share-mv {
          position: relative;
          width: 368px;
          height: 200px;
          margin-top: 10px;
          border-radius: 8px;
          overflow: hidden;
          .m-mv-title {
            display: flex;
            justify-content: center;
            position: absolute;
            left: 0%;
            top: 5%;
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            cursor: pointer;
            &:hover {
              color: #fff;
            }
            span {
              font-size: 13px;
            }
          }
          .m-play-btn {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: all 0.3s linear;
            transform: translate(-50%, -50%);
            background: url("../../assets/play.png");
            background-size: cover;
          }
          .m-play-num {
            position: absolute;
            left: 5px;
            bottom: 5px;
            font-size: 12px;
            color: #fff;
            z-index: 100;
            background: linear-gradient(
              rgba(0, 0, 0, 0.3),
              rgba(129, 118, 118, 0)
            );
            .iconfont {
              font-size: 12px;
              margin-right: 3px;
            }
          }
          .m-mv-time {
            position: absolute;
            right: 5px;
            bottom: 5px;
            z-index: 100;
            font-size: 12px;
            color: #fff;
          }
        }
        .m-enlarge-mv {
          margin-top: 10px;
          .m-enlarge-title {
            display: flex;
            div {
              color: #7d7d7d;
              &:hover {
                color: #545454;
              }
            }
            span {
              color: #aaa;
              &:hover {
                color: #545454;
              }
            }
          }
        }
        .m-enlarge-pic {
          margin-top: 10px;
          min-height: 200px;
          .m-enlarge-img {
            position: relative;
            width: 440px;
            margin: 0 auto;
            border-radius: 8px;
            overflow: hidden;
          }
          .m-left,
          .m-middle,
          .m-right {
            position: absolute;
            top: 0;
            width: 33.3%;
            height: 100%;
          }
          .m-left {
            cursor: url("/left.ico"), auto;
          }
          .m-middle {
            left: 33.3%;
            cursor: -webkit-zoom-out;
          }
          .m-right {
            cursor: url("/right.ico"), auto;
            right: 0;
          }
        }
        .m-time {
          margin-top: 2px;
          margin-bottom: 10px;
          font-size: 12px;
          color: #909090;
        }

        .m-handle {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 10px;
          div {
            font-size: 14px;
            i {
              margin-right: 5px;
            }
          }
        }
        .m-order {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
          font-size: 12px;
          color: #939393;
          div {
            padding: 0 10px;
            border-right: 1px solid #f4f4f4;
            &:last-child {
              border-right: 0;
            }
          }
          .iconfont {
            margin-right: 5px;
            font-size: 12px;
            color: #7d7c7d;
          }
        }
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
