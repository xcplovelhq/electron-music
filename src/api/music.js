import axios from "./axios";

// 获取每日推荐歌曲
const getRecommendSongs = async function(data) {
  const res = await axios.get({
    url: "/recommend/songs",
    data
  });
  return res;
};
// 获取新歌速递
const getTopSong = async function(data) {
  const res = await axios.get({
    url: "/top/song",
    data
  });
  return res;
};
// 喜欢音乐
const setLikeMusic = async function(data) {
  const res = await axios.get({
    url: "/like",
    data
  });
  return res;
};
// 获取音乐url
const getSongUrl = async function(data) {
  const res = await axios.get({
    url: "/song/url",
    data
  });
  return res;
};

export default {
  getTopSong,
  getRecommendSongs,
  setLikeMusic,
  getSongUrl
};
