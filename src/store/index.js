import Vue from "vue";
import Vuex from "vuex";
import User from "./modules/User";
import Play from "./modules/Play";

Vue.use(Vuex);
const state = {
  isShowDrawer: false,
  drawerType: "playList"
};
const mutations = {
  CHANGE_DRAWER_STATUS (state, data) {
    state.isShowDrawer = data;
  },
  SET_DRAWER_TYPE (state, data) {
    state.drawerType = data;
  }
};
export default new Vuex.Store({
  modules: {
    User,
    Play
  },
  state,
  mutations
});
