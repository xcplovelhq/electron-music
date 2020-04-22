<template>
  <div class="g-nav">
    <div class="g-avata" @click="handleLogin">
      <div class="m-avata" @click="handleDetails">
        <img :src="user.avatarUrl" />
      </div>
      <div class="m-name">
        {{ user.nickname || "未登录" }}
        <i class="iconfont">&#xe618;</i>
      </div>
    </div>
    <div class="m-nav-main">
      <div class="m-nav-online">
        <router-link
          class="m-nav-item"
          v-for="item in onlineNav"
          :key="item.key"
          :to="{ path: item.link }"
          :class="{ active: item.isActive }"
        >
          <i class="iconfont" v-html="item.icon"></i>{{ item.name }}
        </router-link>
      </div>
      <div class="m-title">我的音乐</div>
      <div class="m-nav-my">
        <router-link
          class="m-nav-item"
          v-for="item in myNav"
          :key="item.key"
          :to="item.link"
          :class="{ active: item.isActive }"
        >
          <i class="iconfont" v-html="item.icon"></i>{{ item.name }}
        </router-link>
      </div>
      <div class="m-nav-collapse" @click="isShowFound = !isShowFound">
        <i class="iconfont">&#xe618;</i>创建的歌单<i class="iconfont i-add"
          >&#xe61e;</i
        >
      </div>
      <div class="m-nav-my" v-show="isShowFound">
        <template v-for="item in songSheetList">
          <router-link
            class="m-nav-item"
            v-if="!item.subscribed"
            :key="item.key"
            :to="{
              name: 'songSheetDetails',
              query: { id: item.id }
            }"
            :class="{ active: item.isActive }"
          >
            <div class="m-text">
              <template v-if="item.specialType === 5">
                <i class="iconfont">&#xeca1;</i>
                {{ item.name }}
              </template>
              <template v-else>
                <i class="iconfont">&#xe602;</i>
                {{ item.name }}
              </template>
            </div>
          </router-link>
        </template>
      </div>
      <div class="m-nav-collapse" @click="isShowCollapse = !isShowCollapse">
        <i class="iconfont">&#xe618;</i>收藏的歌单
      </div>
      <div class="m-nav-my" v-show="isShowCollapse">
        <template v-for="item in songSheetList">
          <router-link
            class="m-nav-item"
            v-if="item.subscribed"
            :key="item.key"
            :to="{
              name: 'songSheetDetails',
              query: { id: item.id }
            }"
            :class="{ active: item.isActive }"
          >
            <div class="m-text">
              <i class="iconfont">&#xe602;</i>{{ item.name }}
            </div>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
import { getStorage } from "@/lib/store";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isShowFound: true,
      isShowCollapse: false,
      onlineNav: [
        {
          name: "发现音乐",
          icon: "&#xe700",
          link: "/find"
        },
        {
          name: "私人FM",
          icon: "&#xe8b1;",
          link: "fm"
        },
        {
          name: "视频",
          icon: "&#xe637;",
          link: "/video"
        },
        {
          name: "朋友",
          icon: "&#xe61a;",
          link: "friends"
        }
      ],
      myNav: [
        {
          name: "iTunes音乐",
          icon: "&#xe71f;",
          link: "1"
        },
        {
          name: "下载管理",
          icon: "&#xe60b;",
          link: "2"
        },
        {
          name: "我的音乐云盘",
          icon: "&#xe6e7;",
          link: "3"
        },
        {
          name: "我的收藏",
          icon: "&#xe7b3;",
          link: "4"
        }
      ],
      foundNav: [],
      collectNav: [
        {
          name: "我喜欢的音乐",
          icon: "&#xeca1;",
          link: ""
        }
      ]
    };
  },
  created() {
    ipcRenderer.on("setUserInfoData", () => {
      if (getStorage("userInfo")) {
        this.$store.commit(
          "SET_USER_INFO",
          getStorage("userInfo") && getStorage("userInfo")
        );
        this.getUserLikelist({
          uid: this.$store.state.User.userInfo.userId
        }).then(data => {
          this.$store.commit("GET_USER_LIKE_LIST", data.ids);
        });
        this.getUserPlaylist({
          uid: this.$store.state.User.userInfo.userId
        }).then(data => {
          this.$store.commit("GET_USER_SONG_SHEET", data.playlist);
        });
      }
    });
  },
  computed: {
    ...mapState({
      user: state => {
        return getStorage("userInfo") || state.User.userInfo;
      },
      songSheetList: state => {
        return getStorage("likeSongSheet") || state.User.likeSongSheet;
      }
    })
  },
  methods: {
    ...mapActions(["loginCellphone", "getUserPlaylist", "getUserLikelist"]),
    handleLogin() {
      // if (getStorage("userInfo")) {
      //   console.log("321");
      // } else {
      ipcRenderer.send("openWin");
      // }

      // console.log(getStorage("userInfo"), 1111111111111);
    },
    handleDetails() {}
  }
};
</script>

<style lang="less">
.g-nav {
  width: 200px;
  height: 100%;
  background: #ededed;
  .g-avata {
    display: flex;
    align-items: center;
    padding: 10px;
    .m-avata {
      width: 40px;
      height: 40px;
      overflow: hidden;
      border-radius: 50%;
      background: #ccc;
      img {
        width: 100%;
      }
    }
    .m-name {
      margin-left: 10px;
      font-size: 14px;
      color: #444;
      .iconfont {
        vertical-align: middle;
        font-size: 8px;
        color: #8e8e8e;
      }
    }
  }
  .m-nav-main {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
  .m-nav-item {
    display: flex;
    align-items: center;
    padding: 8px 18px;
    font-size: 12px;
    color: #444;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .iconfont {
      font-size: 16px;
      margin-right: 10px;
    }
    .m-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: default;
      .iconfont {
        font-size: 14px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
    &:hover {
      background: #e7e7e7;
    }
  }
  .router-link-exact-active {
    color: @brand-color;
    background: #e2e2e2;
  }
  .m-title {
    padding: 16px 18px 6px 18px;
    font-size: 12px;
    color: rgb(142, 142, 142);
  }
  .m-nav-collapse {
    padding: 15px 14px 6px 6px;
    font-size: 12px;
    color: rgb(142, 142, 142);

    &:hover {
      .iconfont {
        color: #8f8f8f;
      }
      .i-add {
        color: #444;
      }
    }
    .iconfont {
      margin-right: 8px;
      vertical-align: middle;
      font-size: 6px;
      color: #bebebe;
    }
    .i-add {
      float: right;
      margin-right: 0;
      font-size: 20px;
      color: #444;
    }
  }
}
</style>
