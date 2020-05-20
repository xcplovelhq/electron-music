<template>
  <div class="g-collectors">
    <ul>
      <router-link
        tag="li"
        :to="{ name: 'userDetails', query: { id: item.userId } }"
        v-for="item in list"
        :key="item.id"
      >
        <avata :ImgUrl="item.avatarUrl" Size="88"></avata>
        <div class="m-info">
          <h3>{{ item.nickname }}</h3>
          <p>{{ item.signature }}</p>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
import Avata from "@/components/Avata";

export default {
  components: {
    Avata
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style lang="less">
.g-collectors {
  padding: 0 30px;
  ul {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 360px);
    // &::after {
    //   content: "";
    //   flex: auto; /* 或者flex: 1 */
    // }
    li {
      display: flex;
      align-items: center;
      width: 360px;
      margin-bottom: 20px;
      cursor: pointer;
      &:hover {
        border-radius: 100px;
        background: #f3f3f3;
      }
      &:last-child {
        margin-right: auto;
      }
      .m-info {
        flex: 1;
        margin-left: 8px;
        h3 {
          font-size: 14px;
        }
        p {
          font-size: 12px;
          color: #a9a9a9;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }
  }
}
</style>
