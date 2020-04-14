<template>
  <div class="g-new-music">
    <div class="g-warper">
      <div class="m-tabs">
        <div
          class="m-tab"
          :class="{ active: isActive }"
          @click="isActive = true"
        >
          新歌速递
        </div>
        <div
          class="m-tab"
          :class="{ active: !isActive }"
          @click="isActive = false"
        >
          新碟上架
        </div>
      </div>
      <div class="m-nav">
        <ul>
          <li
            v-for="item in typeList"
            :key="item.id"
            :class="{ active: item.id == navId }"
            @click="handleClick(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <template v-if="isActive">
        <Loading v-if="isLoading"></Loading>
        <new-music-list :list="musicList"></new-music-list>
      </template>
      <new-dish v-else :list="albumList"></new-dish>
    </div>
  </div>
</template>

<script>
import NewMusicList from "./components/new-music-list";
import NewDish from "./components/new-dish";
import Loading from "@/components/Loading";

export default {
  components: {
    NewMusicList,
    Loading,
    NewDish
  },
  data() {
    return {
      isActive: true,
      navId: 0,
      musicList: [],
      albumList: [],
      typeList: [
        {
          id: 0,
          name: "全部"
        },
        {
          id: 7,
          name: "华语"
        },
        {
          id: 96,
          name: "欧美"
        },
        {
          id: 8,
          name: "日本"
        },
        {
          id: 16,
          name: "韩国"
        }
      ]
    };
  },
  created() {
    this.getTopSong();
    this.getTopAlbum();
  },
  methods: {
    handleClick(row) {
      this.navId = row.id;
      this.getTopSong();
    },
    getTopSong() {
      this.isLoading = true;
      this.musicList = [];
      this.$api.musicData
        .getTopSong({
          type: this.navId
        })
        .then(({ data }) => {
          this.musicList = data.data;
          this.isLoading = false;
        });
    },
    getTopAlbum() {
      this.isLoading = true;
      this.albumList = [];
      this.$api.albumData
        .getTopAlbum({
          limit: 50
        })
        .then(({ data }) => {
          this.albumList = data.albums;
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="less">
.g-new-music {
  padding-top: 20px;
  .m-tabs {
    display: flex;
    width: 230px;
    margin: 0 auto;
    border-radius: 50px;
    border: 1px solid #bbb;
    overflow: hidden;
    .m-tab {
      width: 115px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      font-size: 12px;
      color: #444;
      border-radius: 50px;
      cursor: default;
      &:hover {
        background: #f5f5f5;
      }
      &.active {
        background: #bbb;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .m-nav {
    margin-top: 22px;
    padding-left: 30px;
    margin-bottom: 10px;
    ul {
      display: flex;
      li {
        margin-right: 30px;
        font-size: 14px;
        color: #888;
        cursor: pointer;
        &:hover,
        &.active {
          color: #000;
        }
      }
    }
  }
}
</style>
