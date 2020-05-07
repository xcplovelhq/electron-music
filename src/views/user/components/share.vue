<template>
  <div class="m-share-box" @click="handleClick">
    <div class="m-avata-bg" v-if="row.json.album">
      <my-image
        :ImgUrl="row.json.album.picUrl"
        IconSize="40px"
        Size="85%"
        Radius="8"
        :isHover="true"
      ></my-image>
    </div>
    <my-image
      v-if="getShareImg(row.json)"
      :ImgUrl="getShareImg(row.json)"
      Size="40px"
      IconSize="20px"
      Radius="4"
    ></my-image>
    <div class="m-share-info" v-if="row.json.song">
      <div class="m-song-name">
        {{ row.json.song.name
        }}{{ row.json.song.alias[0] && "（" + row.json.song.alias[0] + "）" }}
      </div>
      <div class="m-singer-name">
        <span v-for="(i, key) in row.json.song.artists" :key="key">{{
          getSongName(i, key)
        }}</span>
      </div>
    </div>
    <div class="m-share-info" v-else-if="row.json.resource">
      <div class="m-singer-name">歌手：{{ row.json.resource.name }}</div>
    </div>
    <div class="m-share-info" v-else-if="row.json.album">
      <div class="m-song-name">
        {{ row.json.album.name }}
      </div>
      <div class="m-singer-name">
        <span v-for="(i, key) in row.json.album.artists" :key="key">{{
          getSongName(i, key)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  props: {
    row: Object
  },
  methods: {
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    },
    getShareImg(row) {
      if (row.song) {
        return row.song.album && row.song.album.picUrl;
      } else if (row.resource) {
        return row.resource.picUrl;
      }
    },
    handleClick() {
      if (this.row.isShowPic) {
        return;
      }
      if (this.row.json.song) {
        this.$store.dispatch("getSongDetails", { ids: this.row.json.song.id });
      } else if (this.row.json.resource) {
        this.$router.push({
          name: "singerDetails",
          query: { id: this.row.json.resource.id }
        });
      } else if (this.row.json.album) {
        this.$router.push({
          name: "songSheetDetails",
          query: { id: this.row.json.album.id, type: "album" }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.m-share-box {
  display: flex;
  justify-content: flex-start;
  padding: 10px 8px;
  border-radius: 8px;

  &:hover {
    background: #eee;
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
  .m-avata-bg {
    position: relative;
    width: 46px;
    // height: 155px;
    background: url(~@/assets/record-bg.png) no-repeat;
    background-size: cover;
  }
}
</style>
