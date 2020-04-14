<template>
  <div
    class="g-avata"
    :style="{
      width: Size + 'px',
      height: Size + 'px',
      'border-radius': (Radius || +Size / 2) + 'px'
    }"
  >
    <img :src="ImgUrl" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    ImgUrl: String,
    Size: String || Number,
    Radius: String || Number
  }
};
</script>

<style lang="less" scoped>
.g-avata {
  border-radius: 50px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
