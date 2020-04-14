import api from "@/api/index";
import { getStorage, storage } from "@/lib/store";

const state = {
  playInfo: getStorage("playInfo") || {}, // 当前歌曲信息
  playDetails: getStorage("playDetails") || {}, // 当前歌单信息
  playUrls: getStorage("playUrls") || [], // 播放列表url
  isPlay: false, // 是否播放
  volume: getStorage("volume") || 1, // 音量
  loop: getStorage("loop") || "order" // 播放模式
};
const getters = {};
const mutations = {
  SET_PLAY_INFO(state, data) {
    storage("playInfo", data);
    state.playInfo = data;
  },
  SET_PLAY_DETAILS(state, data) {
    storage("playDetails", data);
    state.playDetails = data;
  },
  SET_PLAY_URLS(state, data) {
    state.playUrls = data;
  },
  SET_ISPLAY(state, data) {
    state.isPlay = data;
  },
  SET_VOLUME(state, data) {
    storage("volume", data);
    state.volume = data;
  },
  SET_LOOP(state, data) {
    storage("loop", data);
    state.loop = data;
  }
};
const actions = {
  async getSongUrl({ commit }, payload) {
    let { data } = await api.musicData.getSongUrl(payload);
    if (data.code === 200) {
      storage("playUrls", data.data);
      commit("SET_PLAY_URLS", data.data);
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
