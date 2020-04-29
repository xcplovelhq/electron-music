<template>
  <div class="g-search-list">
    <ul>
      <li v-for="item in list" :key="item.id" @click="handleClick(item)">
        <div class="m-list-img" :class="{ active: type == 'ablums' }">
          <Avata
            :ImgUrl="item.avatarUrl"
            v-if="type == 'user'"
            Size="60"
          ></Avata>
          <my-image
            v-else
            :ImgUrl="item.picUrl || item.coverImgUrl"
            Size="60px"
            Radius="8"
          ></my-image>
        </div>
        <div class="m-username" v-if="type == 'user'">
          <div v-html="getDescribe(item.nickname)"></div>
          <div class="m-sex" v-if="item.gender === 1">
            <i class="iconfont">&#xe631;</i>
          </div>
          <div class="m-sex m-women" v-else>
            <i class="iconfont">&#xe632;</i>
          </div>
        </div>
        <div class="m-tips" v-if="item.accountId">
          <i class="iconfont">&#xe636;</i>
        </div>
        <div class="m-name">
          {{ item.name }}
          <span v-if="item.alias && item.alias.length > 0"
            >({{ item.alias[0] }})</span
          >
        </div>
        <div class="m-ablumsname" v-if="type == 'ablums'">
          {{ item.artist.name }}
          <span v-if="item.artist.alias && item.artist.alias.length > 0"
            >({{ item.artist.alias[0] }})</span
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import MyImage from "@/components/Image";
import Avata from "@/components/Avata";

export default {
  props: {
    list: Array,
    type: String
  },
  components: {
    MyImage,
    Avata
  },
  methods: {
    handleClick(row) {
      switch (this.type) {
        case "singer":
          this.$router.push({ name: "singerDetails", query: { id: row.id } });
          break;
        case "ablums":
          this.$router.push({
            name: "songSheetDetails",
            query: { id: row.id, type: "album" }
          });
          break;
        case "song":
          this.$router.push({
            name: "songSheetDetails",
            query: { id: row.id }
          });
          break;
        case "user":
          this.$router.push({
            name: "userDetails",
            query: { id: row.userId }
          });
          break;
        default:
          break;
      }
    },
    getDescribe(v) {
      let text = v.substring(v.indexOf(this.$route.query.text));
      let rep = new RegExp(this.$route.query.text, "g");
      let resDtring = `<span style='color:#7992B9;'>${this.$route.query.text}</span>`;
      return text.replace(rep, resDtring);
    }
  }
};
</script>

<style lang="less" scoped>
.g-search-list {
  li {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px 30px;
    cursor: pointer;
    &:nth-child(2n) {
      background: #fafafa;
    }
    .m-list-img {
      &.active {
        position: relative;
        width: 71px;
        // height: 155px;
        background: url(../../../assets/record-bg.png) no-repeat;
        background-size: cover;
      }
    }
    &:hover {
      background: #f2f2f3;
    }
    .m-name {
      flex: 1;
      margin-left: 10px;
      font-size: 14px;
      &:hover {
        color: #000;
      }
      span {
        color: #a5a5a5;
      }
    }
    .m-ablumsname {
      flex: 1;
      margin-left: 10px;
      font-size: 12px;
      color: #6c6c6c;
      &:hover {
        color: #000;
      }
      span {
        color: #b2b2b2;
      }
    }
    .m-username {
      display: flex;
      align-items: center;
      margin-left: 10px;
      font-size: 14px;
      color: #7f7f7f;
      &:hover {
        color: #000;
      }
      span {
        color: #b2b2b2;
      }
      .m-sex {
        margin-left: 5px;
        width: 15px;
        height: 15px;
        text-align: center;
        line-height: 12px;
        color: #68b9e8;
        background: #b3f3fe;
        border-radius: 25px;
        .iconfont {
          font-size: 12px;
        }
        &.m-women {
          color: #ff4047;
          background: #ffced7;
        }
      }
    }
    .m-tips {
      position: absolute;
      right: 30px;
      top: 50%;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 12px;
      transform: translateY(-50%);
      background: #e33f3a;
      border-radius: 50px;
      .iconfont {
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>
