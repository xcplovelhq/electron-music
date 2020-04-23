import api from "@/api/index";
import { getStorage, storage } from "@/lib/store";

const state = {
  playInfo: getStorage("playInfo") || {}, // 当前歌曲信息
  playDetails: getStorage("playDetails") || {}, // 当前歌单信息
  playList: getStorage("playList") || [], //播放列表
  playUrls: getStorage("playUrls") || [], // 播放列表url
  playLyric: getStorage("playLyric") || {}, // 歌词
  isPlay: false, // 是否播放
  volume: getStorage("volume") || 1, // 音量
  loop: getStorage("loop") || "order", // 播放模式
  currentTime: "" //播放进度
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
  SET_PLAY_LIST(state, data) {
    storage("playList", data);
    state.playList = data;
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
  },
  SET_LYRIC(state, data) {
    state.playLyric = data;
  },
  SET_CURRENT_TIME(state, data) {
    state.currentTime = data;
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
  },
  async getLyric({ commit }, payload) {
    let { data } = await api.musicData.getLyric(payload);
    if (data.code === 200) {
      storage("playLyric", data);
      commit("SET_LYRIC", data);
      return data ? data : {};
    }
  },
  async getSongDetails({ dispatch, commit }, payload) {
    let { data } = await api.musicData.getSongDetails(payload);
    if (data.code === 200) {
      commit("SET_PLAY_INFO", data.songs[0]);
      dispatch("getSongUrl", { id: payload.ids });
      dispatch("getLyric", { id: payload.ids });
      return data ? data.songs[0] : {};
    }
  }
};
export default {
  state,
  getters,
  mutations,
  actions
};
