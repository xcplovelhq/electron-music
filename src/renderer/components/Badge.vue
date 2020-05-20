<template>
  <div class="g-badge">
    {{ num }}
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: [Number, String],
      default: 0
    }
  }
};
</script>

<style lang="less" scoped>
.g-badge {
  position: absolute;
  right: 10px;
  top: 0;
  transform: translateY(-50%) translateX(100%);
  background-color: #fff;
  border-radius: 10px;
  color: @brand-color;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
</style>
