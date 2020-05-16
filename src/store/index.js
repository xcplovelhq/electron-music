import Vue from "vue";
import Vuex from "vuex";
import User from "./modules/User";
import Play from "./modules/Play";
import createMutationsSharer from "vuex-shared-mutations";

Vue.use(Vuex);
const state = {
  isShowDrawer: false,
  isShowPlayingDrawer: false,
  drawerType: "playList",
  mvArea: ["内地", "港台", "欧美", "日本", "韩国"]
};
const mutations = {
  CHANGE_DRAWER_STATUS(state, data) {
    console.log(data);

    state.isShowDrawer = data;
  },
  CHANGE_PLAYING_DRAWER_STATUS(state, data) {
    state.isShowPlayingDrawer = data;
  },
  SET_DRAWER_TYPE(state, data) {
    state.drawerType = data;
  }
};
export default new Vuex.Store({
  modules: {
    User,
    Play
  },
  state,
  mutations,
  plugins: [
    createMutationsSharer({
      predicate: [
        "SET_PLAY_INFO",
        "SET_VOLUME",
        "SET_PLAY_LIST",
        "SET_ISPLAY",
        "SET_LYRIC",
        "SET_CURRENT_TIME"
      ]
    })
  ]
});
