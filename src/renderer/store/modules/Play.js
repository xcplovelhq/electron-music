import api from "@/api/index";
import { getStorage, storage } from "@/lib/store";
// import { ipcRenderer } from "electron";

// const path = require("path");
const state = {
  playInfo: getStorage("playInfo") || {}, // 当前歌曲信息
  playDetails: getStorage("playDetails") || {}, // 当前歌单信息
  playList: getStorage("playList") || [], //播放列表
  playUrls: getStorage("playUrls") || [], // 播放列表url
  playLyric: getStorage("playLyric") || {}, // 歌词
  isPlay: false, // 是否播放
  isNext: false, // 是否下一首
  isEnd: false, // 是否接受
  volume: getStorage("volume") || 1, // 音量
  loop: getStorage("loop") || "order", // 播放模式
  slider: 0, // 进度条
  currentTime: "", //播放进度
  duration: "", //播放时长
  isShowLyric: getStorage("isShowLyric"), //显示歌词
  isFM: getStorage("isFm") || false,
  fmInfo: getStorage("fmInfo") || {}, // 当前Fm歌曲信息
  fmLyric: getStorage("fmLyric") || {} // 当前Fm歌词
};
const getters = {};
const mutations = {
  SET_PLAY_INFO(state, data) {
    storage("playInfo", data);
    state.playInfo = data;
    // const option = {
    //   title: data.name,
    //   body: data.ar ? data.ar.map(item => item.name) : "",
    //   silent: true,
    //   icon: path.join(__dirname, "../../assets/logo.png")
    // };

    // const myNotification = new window.Notification(option.title, option);
    // myNotification.onclick = () => {
    //   console.log("clicked");
    // };
  },
  GET_PLAY_INFO(state) {
    state.playInfo = getStorage("playInfo");
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
    // storage("isPlay", data);
    state.isPlay = data;
  },
  SET_ISNEXT(state, data) {
    state.isNext = data;
  },
  SET_ISEND(state, data) {
    state.isEnd = data;
  },
  SET_VOLUME(state, data) {
    storage("volume", data);
    state.volume = data;
  },
  SET_LOOP(state, data) {
    storage("loop", data);
    state.loop = data;
  },
  SET_ISSHOWLYRIC(state, data) {
    storage("isShowLyric", data);
    state.isShowLyric = data;
  },
  SET_LYRIC(state, data) {
    state.playLyric = data;
  },
  SET_DURATION(state, data) {
    state.duration = data;
  },
  SET_SLIDER(state, data) {
    state.slider = data;
  },
  SET_CURRENT_TIME(state, data) {
    state.currentTime = data;
  },
  SET_FM(state, data) {
    storage("isFm", data);
    state.isFM = data;
  },
  SET_FM_INFO(state, data) {
    storage("fmInfo", data);
    state.fmInfo = data;
  },
  SET_FM_LYRIC(state, data) {
    storage("fmLyric", data);
    state.fmLyric = data;
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
      if (payload.type === "FM") {
        storage("fmLyric", data);
        commit("SET_FM_LYRIC", data);
      } else {
        storage("playLyric", data);
        commit("SET_LYRIC", data);
      }
      return data ? data : {};
    }
  },
  async getSongDetails({ dispatch, commit, state }, payload) {
    let playList = state.playList;
    let playInfo = state.playInfo;
    let playIdx = playList.findIndex(function(obj) {
      return obj ? obj.id === playInfo.id : -1;
    });
    let rowIdx = playList.findIndex(function(obj) {
      return obj ? obj.id === payload.ids : -1;
    });
    if (rowIdx >= 0) {
      playList.splice(rowIdx, 1);
    }

    let { data } = await api.musicData.getSongDetails(payload);
    if (data.code === 200) {
      if (playIdx >= 0) {
        playList.splice(playIdx + 1, 0, data.songs[0]);
      } else {
        playList.push(data.songs[0]);
      }
      dispatch("getSongUrl", { id: payload.ids });
      dispatch("getLyric", { id: payload.ids });
      commit("SET_PLAY_LIST", playList);
      commit("SET_PLAY_INFO", data.songs[0]);
      commit("SET_ISPLAY", true);
      commit("SET_FM", false);
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
