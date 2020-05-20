<template>
  <div class="g-search">
    <!-- <input
      v-model="searchText"
      ref="input"
      type="text"
      @keyup.native="handleKeyup"
      @keyup.enter.native="handleKeyupEnter"
      @focus.native="handleFocus"
      @blur.native="handleBlur"

      @focus.exact="handleFocus"
      
    /> -->
    <el-input
      ref="input"
      class="m-search-input"
      placeholder="搜索"
      :value="getSearchText"
      clearable
      size="small"
      @input="handleInput"
      @keyup.enter.native="handleKeyupEnter"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <!-- <div class="m-inp" @click="handleFocus"></div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFocus: false
    };
  },
  computed: {
    getDrawerType() {
      return this.$store.state.drawerType;
    },
    isShowDrawer() {
      return this.$store.state.isShowDrawer;
    },
    getSearchHistory() {
      return this.$store.state.User.searchHistory;
    },
    getSearchText() {
      return this.$store.state.User.search;
    }
  },
  methods: {
    handleBlur() {
      this.$store.commit("CHANGE_DRAWER_STATUS", false);
    },
    handleFocus() {
      this.$store.commit("SET_DRAWER_TYPE", "search");
      this.$store.commit("CHANGE_DRAWER_STATUS", true);
    },
    handleInput(row) {
      this.$store.commit("SET_SEARCH", row);
    },
    handleKeyupEnter() {
      let arr = this.getSearchHistory || [];
      if (arr.indexOf(this.getSearchText) > 0) {
        arr.splice(arr.indexOf(this.getSearchText), 1);
      }
      arr.push(this.getSearchText);
      this.$store.commit("SET_SEARCH_HISTORY", arr);
      this.$store.commit("CHANGE_DRAWER_STATUS", false);
      this.$refs.input.blur();
      this.$router.push({
        name: "search",
        query: { text: this.getSearchText }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.g-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 150px;
  height: 23px;
  padding: 0 4px 0 3px;
  border-radius: 50px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  .m-inp {
    position: absolute;
    left: 0;
    top: 0;
    width: 80%;
    height: 100%;
  }
}
</style>

<style lang="less">
.m-search-input {
  cursor: text;

  .el-input__inner {
    background: rgba(255, 255, 255, 0);
    border: 0;
    color: #fff;
    cursor: text;
  }

  .el-input__icon {
    transition: unset;
  }
  .el-input__clear,
  .el-input__prefix,
  .el-input__suffix {
    transition: unset;

    .main-text-color !important;
  }
  input::-webkit-input-placeholder {
    color: #fff;
    opacity: 0.5;
  }
}
</style>
