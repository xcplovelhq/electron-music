import axios from "./axios";

// 获取歌单分类
const getPlaylistCatlist = async function (data) {
  const res = await axios.get({
    url: "/playlist/catlist",
    data
  });
  return res;
};
// 获取热门歌单分类
const getPlaylistHot = async function (data) {
  const res = await axios.get({
    url: "/playlist/hot",
    data
  });
  return res;
};
// 获取歌单
const getTopPlaylist = async function (data) {
  const res = await axios.get({
    url: "/top/playlist",
    data
  });
  return res;
};
// 获取精品歌单
const getPlaylistHighquality = async function (data) {
  const res = await axios.get({
    url: "/top/playlist/highquality",
    data
  });
  return res;
};
// 获取歌单详情
const getPlaylistDetail = async function (data) {
  const res = await axios.get({
    url: "/playlist/detail",
    data
  });
  return res;
};
// 获取歌单评论
const getCommentPlaylist = async function (data) {
  const res = await axios.get({
    url: "/comment/playlist",
    data
  });
  return res;
};

export default {
  getPlaylistHot,
  getPlaylistCatlist,
  getTopPlaylist,
  getPlaylistHighquality,
  getPlaylistDetail,
  getCommentPlaylist
};
