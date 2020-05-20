<template>
  <div class="g-mv-rank">
    <ul>
      <li v-for="(item, idx) in list" :key="item.id">
        <div class="m-num">{{ idx + 1 }}</div>
        <div class="m-img">
          <my-image
            :ImgUrl="item.cover"
            IconSize="40px"
            Size="100%"
            Radius="8"
            :isHover="true"
          ></my-image>
        </div>
        <div class="m-name">
          <h3>{{ item.name }}</h3>
          <p>{{ item.artistName }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import MyImage from "@/components/Image";

export default {
  props: {
    list: Array
  },
  components: {
    MyImage
  }
};
</script>

<style lang="less" scoped>
.g-mv-rank {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 50%;
      display: flex;
      margin-bottom: 20px;
    }
    .m-num {
      width: 36px;
      font-size: 26px;
      line-height: 96px;
      color: #989898;
    }
    .m-img {
      width: 169px;
      height: 96px;
      border-radius: 8px;
      overflow: hidden;
    }
    .m-name {
      flex: 1;
      margin-left: 20px;
      padding-top: 10px;
      padding-right: 20px;
      text-align: left;
      h3 {
        margin-bottom: 10px;
        font-size: 13px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
      p {
        font-size: 12px;
        color: #888;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
    }
  }
}
</style>
