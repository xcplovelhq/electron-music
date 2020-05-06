<template>
  <div class="g-user-dynamic">
    <ul>
      <li v-for="(item, index) in list" :key="item.commentId">
        <template v-if="item.type !== 33">
          <div class="m-img">
            <Avata :ImgUrl="item.user.avatarUrl" Size="35"></Avata>
          </div>
          <div @click="clickaa"></div>
          <div class="m-info">
            <div class="m-name">
              <router-link
                :to="{ name: 'userDetails', query: { id: item.user.userId } }"
                >{{ item.user.nickname }}</router-link
              >
              {{ getType(item) }}
            </div>
            <div class="m-time">
              {{ $moment(item.eventTime).format("YYYY年M月D日 kk:mm") }}
            </div>
            <div class="m-content" v-html="getContent(item)"></div>
            <div
              class="m-share"
              v-if="
                item.json.song ||
                  item.json.resource ||
                  item.json.album ||
                  item.json.event ||
                  item.isShowPic
              "
              @click="handleClick(item)"
              :class="{ 'z-font': item.type == 36 }"
            >
              <div class="flex-justify-start">
                <div class="m-avata-bg" v-if="item.json.album">
                  <my-image
                    :ImgUrl="item.json.album.picUrl"
                    IconSize="40px"
                    Size="85%"
                    Radius="8"
                    :isHover="true"
                  ></my-image>
                </div>
                <my-image
                  v-if="getShareImg(item.json)"
                  :ImgUrl="getShareImg(item.json)"
                  Size="40px"
                  IconSize="20px"
                  Radius="4"
                ></my-image>
                <div class="m-share-info" v-if="item.json.song">
                  <div class="m-song-name">
                    {{ item.json.song.name
                    }}{{
                      item.json.song.alias[0] &&
                        "（" + item.json.song.alias[0] + "）"
                    }}
                  </div>
                  <div class="m-singer-name">
                    <span
                      v-for="(i, key) in item.json.song.artists"
                      :key="key"
                      >{{ getSongName(i, key) }}</span
                    >
                  </div>
                </div>
                <div class="m-share-info" v-else-if="item.json.resource">
                  <div class="m-singer-name">
                    歌手：{{ item.json.resource.name }}
                  </div>
                </div>
                <div class="m-share-info" v-else-if="item.json.album">
                  <div class="m-song-name">
                    {{ item.json.album.name }}
                  </div>
                  <div class="m-singer-name">
                    <span
                      v-for="(i, key) in item.json.album.artists"
                      :key="key"
                      >{{ getSongName(i, key) }}</span
                    >
                  </div>
                </div>
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
                <Loading v-if="isLoading" style="margin-top:100px;"></Loading>

                <div class="m-enlarge-img">
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
            <div
              class="m-pics"
              v-show="item.pics && item.pics.length > 0 && !item.isShowPic"
            >
              <div
                class="m-pic"
                :style="{ width: item.pics.length > 1 ? '120px' : 'auto' }"
                v-for="(v, idx) in item.pics"
                :key="idx"
                @click="hanldeEnlarge(v, item, idx)"
              >
                <my-image
                  v-if="item.pics.length > 1"
                  :ImgUrl="v.pcSquareUrl"
                  Size="100%"
                  Radius="8"
                ></my-image>
                <el-image
                  v-else
                  :src="v.originUrl"
                  style="vertical-align: top;"
                ></el-image>
                <div class="m-tips" v-if="v.height > 2000">长图</div>
              </div>
            </div>
            <div class="m-otder">
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
import MyImage from "@/components/Image";
import Loading from "@/components/Loading";
import { ipcRenderer } from "electron";

export default {
  components: {
    Avata,
    MyImage,
    Loading
  },
  data() {
    return {
      isLoading: false,
      list: [],
      lasttime: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    clickaa() {
      ipcRenderer.send("openUrl", "http://www.baidu.com");
    },
    getShareImg(row) {
      if (row.song) {
        return row.song.album && row.song.album.picUrl;
      } else if (row.resource) {
        return row.resource.picUrl;
      }
    },
    getType(row) {
      let text = "";
      switch (row.type) {
        case 18:
          text = "分享单曲";
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
    getImgLoad() {
      this.isLoading = false;
    },
    getContent(row) {
      let msg = "";
      let reg = /[\r\n]/g;
      let rep = new RegExp("#" + row.actName + "#", "g");
      let resDtring = `<span class="m-hover">#${row.actName}#</span>`;
      msg = row.json.msg ? row.json.msg.replace(rep, resDtring) : "";
      msg = msg ? this.remind(msg) : "";
      return msg.replace(reg, "</br>");
    },
    remind(s) {
      let msg = "";
      if (typeof s != "string") return false;
      // var reg = /@([^\f\n\r\t\v\s\[\]]+)\s?/g;
      let reg = /@([0-9a-zA-Z\u4e00-\u9fa5]+)\s?/g;
      if (s.match(reg) && s.match(reg).length > 0) {
        s.match(reg).forEach(item => {
          msg = s.replace(reg, `<span class="m-hover">${item}</span>`);
        });
      }
      return msg || s;
    },

    handleClick(row) {
      if (row.isShowPic) {
        return;
      }
      if (row.json.song) {
        this.$store.dispatch("getSongDetails", { ids: row.json.song.id });
      } else if (row.json.resource) {
        this.$router.push({
          name: "singerDetails",
          query: { id: row.json.resource.id }
        });
      } else if (row.json.album) {
        this.$router.push({
          name: "songSheetDetails",
          query: { id: row.json.album.id, type: "album" }
        });
      }
    },
    hanldeEnlarge(item, row, idx) {
      row.isShowPic = true;
      row.showPic = item.originUrl;
      row.picIdx = idx;
    },
    handleReduce(row, type) {
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
    lookEnlarge(idx) {
      this.$refs.elImage[idx] && this.$refs.elImage[idx].clickHandler();
    },
    getData() {
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
              if (item.pics && item.pics.length > 0) {
                item.picsList = [];
                item.isShowPic = false;
                item.showPic = "";
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
              if (item.pics && item.pics.length > 0) {
                item.picsList = [];
                item.isShowPic = false;
                item.showPic = "";
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
          padding: 10px 8px;
          border-radius: 8px;
          background: #f5f5f5;
          &.z-font {
            cursor: pointer;
            .m-singer-name {
              font-size: 14px;
              color: #333;
            }
          }
          &:hover {
            background: #eee;
          }
        }
        .m-share-info {
          margin-left: 5px;

          .m-song-name {
            margin-bottom: 5px;
            font-size: 12px;
            color: #555;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .m-singer-name {
            font-size: 12px;
            color: #a0a0a0;
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
        .m-pics {
          display: flex;
          flex-wrap: wrap;
          width: 370px;
          margin-top: 10px;
          .m-pic {
            position: relative;
            width: 120px;
            margin: 0 4px 4px 0;
            border-radius: 8px;
            overflow: hidden;
            cursor: -webkit-zoom-in;
            &:nth-child(3n) {
              margin: 0 0 4px 0;
            }
          }
          .m-tips {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 12px;
            color: #fff;
            padding: 0px 4px;
            border: 1px solid #fff;
            border-radius: 50px;
            background: rgba(0, 0, 0, 0.5);
          }
        }
        .m-handle {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          div {
            font-size: 14px;
            i {
              margin-right: 5px;
            }
          }
        }
        .m-otder {
          display: flex;
          justify-content: flex-end;
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
  }
}
</style>
