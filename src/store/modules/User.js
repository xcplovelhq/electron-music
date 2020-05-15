import api from "@/api/index";
import { ipcRenderer } from "electron";

const state = {
  idLogin: false,
  userInfo: {}, // 用户信息
  likeMusicIds: [], //喜欢的音乐Id
  likeSongSheet: [],
  messageIndex: 0,
  search: "", //搜索内容
  searchHistory: [] //搜索历史
};
const getters = {};
const mutations = {
  SET_USER_INFO(state, payload) {
    state.userInfo = payload;
    state.isLogin = true;
  },
  GET_USER_SONG_SHEET(state, data) {
    state.likeSongSheet = data;
  },
  GET_USER_LIKE_LIST(state, data) {
    state.likeMusicIds = data;
  },
  SET_USER_MSG_NUM(state, data) {
    state.messageIndex = data;
  },
  SET_SEARCH(state, data) {
    state.search = data;
  },
  SET_SEARCH_HISTORY(state, data) {
    state.searchHistory = data;
  },
  SET_DATA(state, data) {
    state[data.stateKey] = data.data;
  }
};
const actions = {
  async loginCellphone({ commit }, payload) {
    let { data } = await api.userData.loginCellphone(payload);
    if (data.code === 200) {
      commit("SET_USER_INFO", data.profile);
      ipcRenderer.send("closeWin");

      return data ? data : {};
    }
  },
  async getUserPlaylist({ commit, state }) {
    let { data } = await api.userData.getUserPlaylist({
      uid: state.userInfo.userId
    });

    if (data.code === 200) {
      commit("GET_USER_SONG_SHEET", data.playlist);
      return data ? data : {};
    }
  },
  async getUserLikelist({ commit, state }) {
    let { data } = await api.userData.getUserLikelist({
      uid: state.userInfo.userId
    });

    if (data.code === 200) {
      commit("GET_USER_LIKE_LIST", data.playlist);
      return data ? data : {};
    }
  },
  async getMsgProvate({ commit }, payload) {
    let { data } = await api.userData.getMsgProvate(payload);
    if (data.code === 200) {
      commit("SET_USER_MSG_NUM", data.newMsgCount);
      return data ? data : {};
    }
  },
  setData({ commit }, data) {
    commit("SET_DATA", data);
  }
};
export default {
  // namespaced: true,
  state,
  getters,
  mutations,
  actions
};
