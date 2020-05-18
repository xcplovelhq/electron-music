<template>
  <div class="g-loop">
    <div class="m-loop" @click="handleLook">
      <el-tooltip
        class="item"
        effect="dark"
        :content="loopList[loopId].name"
        placement="top"
      >
        <i title="1" class="iconfont" v-html="loopList[loopId].icon"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loopId: 0,
      loopValue: "",
      loopList: [
        {
          index: "order",
          name: "顺序播放",
          icon: "&#xe608;"
        },
        {
          index: "list",
          name: "列表循环",
          icon: "&#xe66c;"
        },
        {
          index: "single",
          name: "单曲循环",
          icon: "&#xe66d;"
        },
        {
          index: "random",
          name: "随机播放",
          icon: "&#xe66b;"
        }
      ]
    };
  },
  mounted() {
    this.loopList.forEach((item, idx) => {
      if (item.index === this.$store.state.Play.loop) {
        this.loopId = idx;
      }
    });
  },
  methods: {
    handleLook() {
      this.loopId++;
      if (this.loopId > 3) {
        this.loopId = 0;
      }
      this.loopValue = this.loopList[this.loopId].index;
      this.$store.commit("SET_LOOP", this.loopValue);
    }
  }
};
</script>

<style></style>
