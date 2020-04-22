<template>
  <div class="g-mv-all">
    <div class="g-warper">
      <div class="m-nav" v-for="item in { area, type, order }" :key="item.type">
        {{ item.type }}：
        <ul>
          <li v-for="i in item.data" :key="i.index">
            <div
              class="m-name"
              @click="handleClick(item, i)"
              :class="{ active: item.value == i.index }"
            >
              {{ i.name }}
            </div>
          </li>
        </ul>
      </div>
      <Loading v-if="mvList && mvList.length <= 0"></Loading>
      <mv-list
        v-else
        :list="mvList"
        style="margin-top: 10px"
        v-infinite-scroll="load"
      ></mv-list>
    </div>
  </div>
</template>

<script>
import MvList from "./components/mv-list";
import Loading from "@/components/Loading";

export default {
  components: {
    MvList,
    Loading
  },

  data() {
    return {
      mvList: [],
      limit: 10,
      area: {
        type: "地区",
        value: "",
        data: [
          {
            name: "全部",
            index: ""
          }
        ]
      },
      type: {
        type: "类型",
        value: "",
        data: [
          {
            name: "全部",
            index: ""
          },
          {
            name: "官方版",
            index: "官方版"
          },
          {
            name: "原生",
            index: "原生"
          },
          {
            name: "现场版",
            index: "现场版"
          },
          {
            name: "网易出品",
            index: "网易出品"
          }
        ]
      },
      order: {
        type: "排序",
        value: "",
        data: [
          {
            name: "上升最快",
            index: ""
          },
          {
            name: "最热",
            index: "最热"
          },
          {
            name: "最新",
            index: "最新"
          }
        ]
      }
    };
  },
  created() {
    this.getArea();
  },
  methods: {
    handleClick(item, i) {
      this.mvList = [];
      this.limit = 10;
      item.value = i.index;
      this.getMvAll();
    },
    load() {
      if (this.mvList.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getMvAll();
    },
    getArea() {
      this.$store.state.mvArea.forEach(item => {
        this.area.data.push({
          name: item,
          index: item
        });
      });
      this.area.value = this.$route.query.area;
      this.type.value = this.$route.query.type;
      this.order.value = this.$route.query.order;
      this.getMvAll();
    },
    getMvAll() {
      this.$api.videoData
        .getMvAll({
          area: this.area.value,
          type: this.type.value,
          order: this.order.value,
          limit: this.limit
        })
        .then(({ data }) => {
          this.mvList = data.data;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-mv-all {
  .g-warper {
    padding: 15px 30px;
  }
  .m-nav {
    display: flex;
    font-size: 13px;
    color: #555;
    ul {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 75px;
        margin-bottom: 8px;
        text-align: center;
        border-right: 1px solid #f6f6f6;
        .m-name {
          cursor: default;
          display: inline-block;
          height: 20px;
          padding: 0 10px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          color: #858585;
          &:hover {
            color: #444;
          }
          &.active {
            color: #c6382e;
            background: #fbf6f6;
            border-radius: 50px;
          }
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
}
</style>
