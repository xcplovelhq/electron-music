import api from "@/api/index";
import { getStorage, storage } from "@/lib/store";

const state = {
  idLogin: false,
  userInfo: getStorage("userInfo") || {}, // 用户信息
  likeMusicIds: getStorage("likeMusicIds") || [], //喜欢的音乐Id
  likeSongSheet: getStorage("likeSongSheet") || [],
  messageIndex: 0
};
const getters = {};
const mutations = {
  SET_USER_INFO(state, payload) {
    state.userInfo = payload;
    state.isLogin = true;
  },
  GET_USER_SONG_SHEET(state, data) {
    storage("likeSongSheet", data);
    state.likeSongSheet = data;
  },
  GET_USER_LIKE_LIST(state, data) {
    storage("likeMusicIds", data);
    state.likeMusicIds = data;
  },
  SET_USER_MSG_NUM(state, data) {
    state.messageIndex = data;
  }
};
const actions = {
  async loginCellphone({ commit }, payload) {
    let { data } = await api.userData.loginCellphone(payload);
    if (data.code === 200) {
      commit("SET_USER_INFO", data.profile);
      return data ? data : {};
    }
  },
  async getUserPlaylist({ commit }, payload) {
    let { data } = await api.userData.getUserPlaylist(payload);

    if (data.code === 200) {
      commit("GET_USER_SONG_SHEET", data.playlist);
      return data ? data : {};
    }
  },
  async getUserLikelist({ commit }, payload) {
    let { data } = await api.userData.getUserLikelist(payload);

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
  }
};
export default {
  state,
  getters,
  mutations,
  actions
};
