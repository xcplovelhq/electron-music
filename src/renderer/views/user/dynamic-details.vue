<template>
  <div class="g-dynamic-details">
    <div>
      <Dynamic :item="info.json.event" :index="0"></Dynamic>
    </div>
    <div class="m-common">
      <comment-list type="dynamic" class="m-comment"></comment-list>
    </div>
  </div>
</template>

<script>
import Dynamic from "./components/dynamic";
import CommentList from "@/components/CommentList";

export default {
  components: {
    Dynamic,
    CommentList
  },
  data() {
    return {
      info: {}
    };
  },
  created() {
    this.info = this.$route.params.info;
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.g-dynamic-details {
  padding: 14px 40px 30px 30px;
  .m-common {
    padding: 20px 0;
  }
}
</style>
