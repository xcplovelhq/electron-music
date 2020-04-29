<template>
  <div class="g-ranking-list">
    <div class="g-warper">
      <div class="m-title">官方榜</div>
      <div class="m-official">
        <div class="m-items" v-for="item in officialList" :key="item.idx">
          <a-skeleton
            v-if="item.data && item.data.length <= 0"
            :avatar="{ size: 170, shape: 'square' }"
            active
            :paragraph="{ rows: 4 }"
          />
          <template v-else>
            <div class="m-img">
              <el-image
                class="m-bac"
                :src="item.bacUrl || require('@/assets/disc.png')"
                fit="fill"
                style="width: 100%; height: 100%"
              >
                <div class="m-error" slot="placeholder">
                  <i slot="placeholder" class="iconfont">&#xe635;</i>
                </div>
              </el-image>
              <el-image
                class="m-pic"
                :src="item.picUrl || require('@/assets/disc.png')"
                fit="fill"
                style="width: 100%; height: 100%"
              >
                <div class="m-error" slot="placeholder">
                  <i slot="placeholder" class="iconfont">&#xe635;</i>
                </div>
              </el-image>
              <!-- <img class="m-bac" :src="item.bacUrl" fit="fill" />
            <img class="m-pic" :src="item.picUrl" fit="fill" /> -->
              <div class="m-time">{{ item.time }}</div>
            </div>
            <div class="m-list">
              <ul>
                <template v-for="(i, idx) in item.data">
                  <li :key="i.id" v-if="idx < 5">
                    <div class="flex-justify-start">
                      <div class="m-num">{{ idx + 1 }}</div>
                      <div class="m-tag"></div>
                      <div class="m-song-name">
                        {{ i.name }}
                        <span v-if="i.alia && i.alia.length > 0"
                          >（{{ i.alia[0] }}）</span
                        >
                      </div>
                    </div>
                    <div class="m-name">
                      <router-link to="" v-for="(v, idx) in i.ar" :key="v.id">{{
                        getSongName(v, idx)
                      }}</router-link>
                    </div>
                  </li>
                </template>
              </ul>
              <div class="m-more">
                <router-link
                  :to="{ name: 'songSheetDetails', query: { id: item.id } }"
                  >查看更多</router-link
                >
                <i class="iconfont">&#xe72b;</i>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="m-title">全球榜</div>
      <div class="m-global">
        <song-sheet :list="globalList" :max="4"></song-sheet>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import SongSheet from "@/components/SongSheet";

export default {
  components: {
    SongSheet
  },
  data() {
    return {
      globalList: [],
      officialList: [
        {
          name: "飙升榜",
          idx: 3,
          picUrl: "",
          bacUrl: "",
          time: "",
          data: []
        },
        {
          name: "新歌榜",
          idx: 0,
          picUrl: "",
          time: "",
          data: []
        },
        {
          name: "原创榜",
          idx: 1,
          picUrl: "",
          time: "",
          data: []
        },
        {
          name: "热歌榜",
          idx: 2,
          picUrl: "",
          time: "",
          data: []
        }
      ]
    };
  },
  created() {
    this.getTopList();
    this.getAllTopList();
  },
  methods: {
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    getTopList() {
      this.officialList.forEach((item, idx) => {
        this.$api.findData
          .getTopList({
            idx: item.idx
          })
          .then(({ data }) => {
            this.officialList[idx].picUrl = data.playlist.coverImgUrl;
            this.officialList[idx].time = Moment(
              data.playlist.updateTime
            ).format("MM月DD日更新");
            this.officialList[idx].bacUrl = data.playlist.tracks[0].al.picUrl;
            this.officialList[idx].data = data.playlist.tracks;
            this.officialList[idx].id = data.playlist.id;
          });
      });
    },
    getAllTopList() {
      this.$api.findData.getAllTopList().then(({ data }) => {
        this.globalList = data.list;
        data.list.forEach((item, idx) => {
          this.globalList[idx].picUrl = item.coverImgUrl;
        });
      });
    }
  }
};
</script>

<style lang="less">
.g-ranking-list {
  padding: 30px;
  .m-title {
    margin-bottom: 14px;
    font-size: 16px;
    color: #444;
  }
  .m-official {
    .m-items {
      display: flex;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .m-img {
        position: relative;
        width: 170px;
        height: 170px;
        overflow: hidden;
        border-radius: 8px;
      }
      .m-time {
        position: absolute;
        left: 0;
        top: 110px;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #fff;
      }
      .m-pic {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.9;
      }
      .m-bac {
        width: 100%;
        height: 100%;
        filter: blur(2px);
      }
      .m-list {
        flex: 1;
        margin-left: 30px;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 34px;
          padding: 0 10px;
          &:nth-child(2n -1) {
            background: #fafafa;
          }
          &:nth-child(-n + 3) {
            .m-num {
              color: #e67875;
            }
          }
          &:hover {
            background: #f5f5f5;
          }
          .m-num {
            margin-right: 12px;
            font-size: 14px;
            color: #adadad;
          }
          .m-song-name {
            font-size: 12px;
            color: #444;
            span {
              font-size: 12px;
              color: #858585;
            }
          }
          .m-name {
            a {
              font-size: 12px;
              color: #afafaf;
              &:hover {
                color: #444;
              }
            }
          }
        }
        .m-more {
          margin-top: 10px;
          padding-left: 10px;
          .iconfont {
            font-size: 10px;
            vertical-align: middle;
          }
          a {
            font-size: 13px;
            color: #858585;
            &:hover {
              color: #444;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.g-ranking-list {
  .m-error {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #e0e0e0;
    .iconfont {
      font-size: 4em;
      color: #fff;
    }
  }
}
</style>
