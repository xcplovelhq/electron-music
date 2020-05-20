<template>
  <div class="g-singer-list">
    <ul>
      <router-link
        v-for="item in singerList"
        :key="item.id"
        tag="li"
        :to="{
          name: 'singerDetails',
          query: { id: item.id }
        }"
      >
        <MyImage
          class="m-avata"
          :ImgUrl="item.picUrl"
          Size="140"
          Radius="8"
        ></MyImage>
        <div class="m-info">
          <h3>{{ item.name }}</h3>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
import Moment from "moment";
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  data() {
    return {
      isLoading: false,
      singerList: [],
      limit: 10
    };
  },
  created() {
    this.getSimiArtist();
  },
  methods: {
    getTime(time) {
      return Moment(time).format("YYYY-MM-DD");
    },
    handleClick(row) {
      this.$router.push({
        name: "songSheetDetails",
        query: { id: row.id, type: "album" }
      });
    },
    load() {
      if (this.list.length < this.limit) {
        return;
      }
      this.limit += 10;
      this.getArtistAlbum();
    },
    getSimiArtist() {
      this.isLoading = true;
      this.$api.singerData
        .getSimiArtist({
          id: this.$route.query.id,
          limit: this.limit
        })
        .then(({ data }) => {
          this.isLoading = false;
          this.singerList = data.artists;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.g-singer-list {
  padding: 0 30px;
  ul {
    display: grid;
    grid-row-gap: 10px;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 19%);
    // &::after {
    //   content: "";
    //   flex: auto; /* 或者flex: 1 */
    // }
    li {
      min-width: 134px;
      margin-bottom: 20px;
      &:last-child {
        margin-right: auto;
      }
      .m-avata {
        cursor: pointer;
      }
      .m-info {
        margin-top: 5px;
        h3 {
          cursor: pointer;
          font-size: 13px;
          color: #444;
          &:hover {
            color: #000;
          }
        }
      }
    }
  }
}
</style>
