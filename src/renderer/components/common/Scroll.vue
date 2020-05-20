<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
BScroll.use(MouseWheel);
export default {
  props: {
    data: {
      type: [Array, String],
      default: null
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(".wrapper", {
        mouseWheel: {
          speed: 1000,
          invert: false,
          easeTime: 0
        }
      });
    });
  },
  methods: {
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style lang="less">
.wrapper {
  // overflow: hidden;
  height: 100%;
}
</style>
