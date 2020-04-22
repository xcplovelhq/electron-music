<template>
  <div class="g-mv-list">
    <div class="m-items" v-for="item in list" :key="item.key">
      <mv-image :mv="item" :type="type"></mv-image>
      <!-- <div class="m-img" @click="handleClick(item)">
        <el-image
          class="img"
          :src="item.cover || item.data.coverUrl"
          fit="cover"
        ></el-image>
        <div class="m-play-num">
          <i class="iconfont">&#xe607;</i
          >{{
            getSumData(item.playCount || (item.data && item.data.praisedCount))
          }}
        </div>
        <div class="m-time" v-if="item.data">
          {{ $moment(item.data.durationms).format("mm:ss") }}
        </div>
      </div> -->
      <div class="m-text" @click="handleClick(item)">
        {{ item.name || item.data.title }}
      </div>
      <div class="m-name">
        <span v-if="item.data">by</span>
        <router-link :to="{ name: 'singerDetails', query: { id: item.id } }">
          {{ item.artistName || (item.data && item.data.creator.nickname) }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getSum } from "@/lib/utils";
import MvImage from "@/components/MvImage";
export default {
  components: {
    MvImage
  },
  props: {
    list: Array,
    type: String
  },
  data () {
    return {
      isLoading: false,
      limit: 10
    };
  },

  methods: {
    getSumData (time) {
      return getSum(time);
    },
    handleClick (item) {
      let id = 0;
      if (this.type === "video") {
        id = item.data.vid;
      } else {
        id = item.id;
      }
      this.$router.push({
        name: "mvDetails",
        query: { id: id, type: this.type }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.g-mv-list {
  display: grid;
  // flex-wrap: wrap;
  justify-content: space-between;
  grid-row-gap: 10px;
  grid-template-columns: repeat(auto-fill, 32%);
  .m-items {
    // min-width: 230px;
    margin-bottom: 40px;
    .m-text {
      margin-top: 5px;
      font-size: 13px;
      color: #555;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
    .m-name {
      padding: 0;
      margin: 0;
      text-align: left;
      a {
        font-size: 12px;
        color: #bfbfbf;
        &:hover {
          color: #a2a2a2;
        }
      }
    }
  }
}
</style>
