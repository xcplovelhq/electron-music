<template>
  <div class="g-singer">
    <div class="g-warper">
      <div
        class="m-nav"
        v-for="item in { languages, classify, screen }"
        :key="item.type"
      >
        {{ item.type }}：
        <ul>
          <li v-for="i in item.data" :key="i.index">
            <div
              class="m-name"
              @click="handleClick(item, i)"
              :class="{ active: item.value == i.index }"
            >
              {{ i.name }}
            </div>
          </li>
        </ul>
      </div>
      <div class="m-list">
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
            <my-image :ImgUrl="item.picUrl" Size="100%" Radius="8"></my-image>
            <!-- <avata
              class="m-avata"
              :ImgUrl="item.picUrl"
              Size="140"
              Radius="8"
            ></avata> -->
            <div class="m-info">
              <h3>{{ item.name }}</h3>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MyImage from "@/components/Image";

export default {
  components: {
    MyImage
  },
  data () {
    return {
      languages: {
        type: "语种",
        value: "",
        data: [
          {
            name: "全部",
            index: ""
          },
          {
            name: "华语",
            index: "100"
          },
          {
            name: "欧美",
            index: "200"
          },
          {
            name: "日本",
            index: "600"
          },
          {
            name: "韩国",
            index: "700"
          },
          {
            name: "其他",
            index: "400"
          }
        ]
      },
      classify: {
        type: "分类",
        value: "",
        data: [
          {
            name: "全部",
            index: ""
          },
          {
            name: "男歌手",
            index: "1"
          },
          {
            name: "女歌手",
            index: "2"
          },
          {
            name: "乐队组合",
            index: "3"
          }
        ]
      },
      screen: {
        type: "筛选",
        value: "",
        data: [
          {
            name: "全部",
            index: ""
          },
          {
            name: "A",
            index: "a"
          },
          {
            name: "B",
            index: "b"
          },
          {
            name: "C",
            index: "c"
          },
          {
            name: "D",
            index: "d"
          },
          {
            name: "E",
            index: "e"
          },
          {
            name: "F",
            index: "f"
          },
          {
            name: "G",
            index: "g"
          },
          {
            name: "H",
            index: "h"
          },
          {
            name: "I",
            index: "i"
          },
          {
            name: "J",
            index: "j"
          },
          {
            name: "K",
            index: "k"
          },
          {
            name: "L",
            index: "l"
          },
          {
            name: "M",
            index: "m"
          },
          {
            name: "N",
            index: "n"
          },
          {
            name: "O",
            index: "o"
          },
          {
            name: "P",
            index: "p"
          },
          {
            name: "Q",
            index: "q"
          },
          {
            name: "R",
            index: "r"
          },
          {
            name: "S",
            index: "s"
          },
          {
            name: "T",
            index: "t"
          },
          {
            name: "U",
            index: "u"
          },
          {
            name: "V",
            index: "v"
          },
          {
            name: "W",
            index: "w"
          },
          {
            name: "X",
            index: "x"
          },
          {
            name: "Y",
            index: "y"
          },
          {
            name: "Z",
            index: "z"
          },
          {
            name: "#",
            index: "#"
          }
        ]
      },
      singerList: []
    };
  },
  created () {
    this.getArtistList();
  },
  methods: {
    handleClick (item, i) {
      item.value = i.index;
      this.getArtistList();
    },
    getArtistList () {
      this.$api.singerData
        .getArtistList({
          cat: this.languages.value + this.classify.value,
          initial: this.screen.value
        })
        .then(({ data }) => {
          this.singerList = data.artists;
        });
    }
  }
};
</script>

<style lang="less">
.g-singer {
  padding: 20px 30px;
  .m-nav {
    display: flex;
    font-size: 13px;
    color: #555;
    ul {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 75px;
        margin-bottom: 8px;
        text-align: center;
        border-right: 1px solid #f6f6f6;
        .m-name {
          cursor: default;
          display: inline-block;
          height: 20px;
          padding: 0 10px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          color: #858585;
          &:hover {
            color: #444;
          }
          &.active {
            color: #c6382e;
            background: #fbf6f6;
            border-radius: 50px;
          }
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
  .m-list {
    margin-top: 20px;
    ul {
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 140px);
      // &::after {
      //   content: "";
      //   flex: auto; /* 或者flex: 1 */
      // }
      li {
        width: 140px;
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
}
</style>
