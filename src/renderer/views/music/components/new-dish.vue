<template>
  <div class="g-new-dish">
    <ul>
      <router-link
        v-for="item in list"
        :key="item.id"
        tag="li"
        :to="{
          name: 'songSheetDetails',
          query: { id: item.id, type: 'album' }
        }"
      >
        <div class="m-avata-bg">
          <my-image
            class="m-avata"
            :ImgUrl="item.blurPicUrl"
            IconSize="40px"
            Size="85%"
            Radius="8"
            :isHover="true"
          ></my-image>
        </div>

        <div class="m-info">
          <h3>{{ item.name }}</h3>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
import MyImage from "@/components/Image";
export default {
  components: {
    MyImage
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>
<style lang="less">
.g-new-dish {
  padding: 30px;
  ul {
    display: grid;
    // flex-wrap: wrap;
    justify-content: space-between;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    grid-template-columns: repeat(auto-fill, 18%);
    li {
      width: 100%;
      margin-bottom: 20px;
      cursor: pointer;
      &:last-child {
        margin-right: auto;
      }
      .m-avata-bg {
        position: relative;
        // width: 183px;
        // height: 155px;
        background: url(../../../assets/record-bg.png) no-repeat;
        background-size: cover;
      }
      .m-avata {
      }
      .m-info {
        margin-top: 5px;
        h3 {
          cursor: pointer;
          font-size: 13px;
          color: #444;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          &:hover {
            color: #000;
          }
        }
      }
    }
  }
}
</style>
