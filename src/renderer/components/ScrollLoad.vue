<template>
  <div
    class="g-scroll-load"
    v-infinite-scroll="load"
    infinite-scroll-immediate
    :infinite-scroll-disabled="disabled"
  >
    <slot></slot>
    <Loading v-if="loading">
      <span style="font-size:14px; margin-left:5px;">加载中...</span>
    </Loading>
  </div>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  props: {
    more: Boolean,
    loading: Boolean
  },
  computed: {
    disabled() {
      return this.loading || !this.more;
    }
  },
  methods: {
    load() {
      if (this.more) {
        this.$emit("load");
      }
    }
  }
};
</script>

<style lang="less">
.g-scroll-load {
  .m-no {
    text-align: center;
  }
}
</style>
