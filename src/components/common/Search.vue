<template>
  <div class="g-search">
    <el-input
      ref="input"
      class="m-input"
      placeholder="搜索"
      v-model="searchText"
      clearable
      size="small"
      @focus="handleFocus"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      isFocus: false
    };
  },
  methods: {
    handleFocus(event) {
      if (!event.relatedTarget) {
        this.$store.commit("CHANGE_DRAWER_STATUS", true);
      }
      setTimeout(() => {
        this.$refs.input.focus();
      }, 10);
    }
  }
};
</script>

<style lang="less" scoped>
.g-search {
  display: flex;
  align-items: center;
  width: 150px;
  height: 23px;
  padding: 0 4px 0 3px;
  border-radius: 50px;
  overflow: hidden;
  background: #e56866;
}
</style>

<style lang="less">
.m-input {
  cursor: text;

  .el-input__inner {
    background: #e56866;
    border: 0;
    color: #fff;
    cursor: text;
  }
  .el-input__clear,
  .el-input__prefix,
  .el-input__suffix {
    .main-text-color !important;
  }
  input::-webkit-input-placeholder {
    color: #fff;
    opacity: 0.5;
  }
}
</style>
