<template>
  <div class="g-new-music">
    <div class="m-items">
      <div class="m-item" v-for="(item, index) in list" :key="item.key">
        <router-link to="">
          <avata :ImgUrl="item.picUrl" Size="60" Radius="8"></avata>
        </router-link>
        <div class="m-num">
          {{ getSum(index + 1) }} <i class="iconfont">&#xe810;</i>
        </div>
        <div class="m-text">
          <h3 :title="item.song && item.song.name + (item.song.alias[0] || '')">
            {{ item.song.name
            }}<span v-if="item.song.alias[0]"
              >（{{ item.song.alias[0] }}）</span
            >
          </h3>
          <p :title="getSongNameTitle(item.song.artists)">
            <router-link
              to=""
              v-for="(i, idx) in item.song.artists"
              :key="i.key"
              >{{ getSongName(i, idx) }}</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avata from "@/components/Avata";
export default {
  components: {
    Avata
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    min: {
      type: [String, Number],
      default: 9
    }
  },
  methods: {
    getSum(idx) {
      if (idx < 10) {
        return "0" + idx;
      } else {
        return idx;
      }
    },
    getSongNameTitle(row) {
      return row.map(item => item.name).join(" / ");
    },
    getSongName(item, idx) {
      if (idx > 0) {
        return " / " + item.name;
      } else {
        return item.name;
      }
    }
  }
};
</script>

<style lang="less">
.g-new-music {
  width: 100%;

  .m-items {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .m-item {
    display: flex;
    width: 48%;
    align-items: center;
    padding: 8px 0px 8px 10px;
    margin-right: 30px;
    border-top: 1px solid #f1f1f1;
    &:hover {
      background: #f5f5f5;
    }
    &:nth-child(5n) {
      border-bottom: 1px solid #f7f7f7;
    }
    &:nth-child(n + 6) {
      margin-right: 0px;
    }
    .m-num {
      margin: 0 10px;
      font-size: 12px;
      color: #c5c5c5;
      .iconfont {
        color: @brand-color;
      }
    }
    .m-text {
      flex: 1;
    }
    h3 {
      font-size: 14px;
      color: #444;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      span {
        color: #c5c5c5;
      }
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      a {
        font-size: 12px;
        color: #6f6f6f;
      }
    }
  }
}
</style>
